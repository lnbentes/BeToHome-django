import uuid
import logging
from datetime import date
from decimal import Decimal

from django.db import transaction as db_transaction
from django.db.models import F, Q, Sum

from app_core.models import Category, Account, Transaction

logger = logging.getLogger(__name__)


class CategoryService:
    @staticmethod
    def get_user_queryset(user):
        """Retorna categorias do usuário + categorias globais (sem dono)."""
        return Category.objects.filter(Q(user=user) | Q(user__isnull=True))

    @staticmethod
    def get_queryset():
        return Category.objects.all()


class AccountService:
    @staticmethod
    def get_user_queryset(user):
        return Account.objects.filter(user=user)

    @staticmethod
    def get_queryset():
        return Account.objects.all()


class TransactionService:
    @staticmethod
    def get_user_transactions(user):
        return Transaction.objects.filter(user=user).select_related('category', 'account')

    @staticmethod
    def get_filtered_transactions(user, year=None, month=None, search=None,
                                   min_amount=None, max_amount=None, tx_type=None):
        qs = Transaction.objects.filter(user=user).select_related(
            'category', 'account', 'to_account'
        )
        if year:
            qs = qs.filter(date__year=year)
        if month:
            qs = qs.filter(date__month=month)
        if search:
            qs = qs.filter(description__icontains=search)
        if min_amount is not None:
            qs = qs.filter(amount__gte=min_amount)
        if max_amount is not None:
            qs = qs.filter(amount__lte=max_amount)
        if tx_type:
            qs = qs.filter(type=tx_type)
        return qs.order_by('-date')

    # ── Gerenciamento de saldo ────────────────────────────────────────────────

    @staticmethod
    def _apply_balance(tx):
        """Aplica o efeito da transação no saldo da(s) conta(s) se ainda não aplicado
        e se a data da transação for menor ou igual a hoje (padrão bancário BR)."""
        today = date.today()
        if tx.balance_applied or tx.date > today:
            return

        with db_transaction.atomic():
            if tx.type == 'INCOME':
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') + tx.amount
                )
            elif tx.type == 'EXPENSE':
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') - tx.amount
                )
            elif tx.type == 'TRANSFER' and tx.to_account_id:
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') - tx.amount
                )
                Account.objects.filter(id=tx.to_account_id).update(
                    balance=F('balance') + tx.amount
                )
            else:
                # Tipo desconhecido ou TRANSFER sem destino — não aplica
                return

            Transaction.objects.filter(id=tx.id).update(balance_applied=True)
            tx.balance_applied = True
            logger.debug('Saldo aplicado: tx=%s tipo=%s valor=%s', tx.id, tx.type, tx.amount)

    @staticmethod
    def _reverse_balance(tx):
        """Reverte o efeito da transação no saldo da(s) conta(s) se foi aplicado."""
        if not tx.balance_applied:
            return

        with db_transaction.atomic():
            if tx.type == 'INCOME':
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') - tx.amount
                )
            elif tx.type == 'EXPENSE':
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') + tx.amount
                )
            elif tx.type == 'TRANSFER' and tx.to_account_id:
                Account.objects.filter(id=tx.account_id).update(
                    balance=F('balance') + tx.amount
                )
                Account.objects.filter(id=tx.to_account_id).update(
                    balance=F('balance') - tx.amount
                )

            Transaction.objects.filter(id=tx.id).update(balance_applied=False)
            tx.balance_applied = False
            logger.debug('Saldo revertido: tx=%s tipo=%s valor=%s', tx.id, tx.type, tx.amount)

    # ── CRUD com controle de saldo ────────────────────────────────────────────

    @staticmethod
    def create_with_installments(user, data, installments=1):
        """Cria uma transação simples (ou N parcelas) e aplica o saldo imediatamente
        apenas nas parcelas cujo mês já chegou (padrão bancário BR)."""
        installments = int(installments or 1)
        tx_type = data.get('type', 'EXPENSE')

        # Transferências não suportam parcelamento
        if tx_type == 'TRANSFER':
            installments = 1
            # Método é opcional para transferências — usa PIX como padrão brasileiro
            data.setdefault('method', 'PIX')

        if installments <= 1:
            transaction = Transaction.objects.create(user=user, **data)
            TransactionService._apply_balance(transaction)
            logger.info('Transação criada: id=%s user=%s', transaction.id, user.id)
            return [transaction]

        total_amount = Decimal(str(data['amount']))
        installment_value = (total_amount / installments).quantize(Decimal('0.01'))
        remainder = total_amount - (installment_value * installments)

        group_id = str(uuid.uuid4())
        base_date = data['date']

        created = []
        for i in range(installments):
            total_months = base_date.month - 1 + i
            y = base_date.year + total_months // 12
            m = total_months % 12 + 1
            try:
                installment_date = base_date.replace(year=y, month=m)
            except ValueError:
                import calendar
                last_day = calendar.monthrange(y, m)[1]
                installment_date = base_date.replace(year=y, month=m, day=last_day)

            amount = installment_value + (remainder if i == 0 else Decimal('0'))
            t = Transaction.objects.create(
                user=user,
                description=data['description'],
                amount=amount,
                type=data['type'],
                method=data.get('method', 'DEBIT'),
                category=data.get('category'),
                account=data.get('account'),
                date=installment_date,
                installment_current=i + 1,
                installment_total=installments,
                installment_id_group=group_id,
            )
            # Aplica ao saldo somente se a parcela for do mês atual ou passado
            TransactionService._apply_balance(t)
            created.append(t)

        logger.info('%d parcelas criadas (grupo=%s) user=%s', installments, group_id, user.id)
        return created

    @staticmethod
    def update_transaction(instance, data):
        """Edita uma transação revertendo o efeito antigo e aplicando o novo."""
        # Reverte o efeito da transação antes de alterar os dados
        TransactionService._reverse_balance(instance)

        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()

        # Aplica o novo efeito (somente se data <= hoje)
        TransactionService._apply_balance(instance)
        logger.info('Transação atualizada: id=%s user=%s', instance.id, instance.user_id)
        return instance

    @staticmethod
    def delete_transaction(transaction):
        """Exclui uma transação e reverte o efeito no saldo."""
        TransactionService._reverse_balance(transaction)
        tx_id = transaction.id
        transaction.delete()
        logger.info('Transação excluída: id=%s', tx_id)


class FinanceService:
    """Regras de negócio e relatórios financeiros."""

    @staticmethod
    def get_monthly_summary(user, year: int, month: int) -> dict:
        """Retorna receitas, despesas e saldo líquido do mês para o usuário.
        Transferências são excluídas (não representam ganho nem perda)."""
        qs = Transaction.objects.filter(user=user, date__year=year, date__month=month)
        income = (
            qs.filter(type='INCOME').aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
        )
        expense = (
            qs.filter(type='EXPENSE').aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
        )
        return {
            'income': float(income),
            'expense': float(expense),
            'balance': float(income - expense),
        }

    @staticmethod
    def get_category_breakdown(user, year: int, month: int) -> list:
        """Retorna o total de despesas agrupado por categoria."""
        qs = Transaction.objects.filter(
            user=user, date__year=year, date__month=month, type='EXPENSE'
        ).select_related('category')

        breakdown = {}
        for t in qs:
            key = t.category.name if t.category else 'Sem Categoria'
            if key not in breakdown:
                breakdown[key] = {
                    'name': key,
                    'color': t.category.color if t.category else '#888888',
                    'icon': t.category.icon if t.category else 'help-outline',
                    'total': Decimal('0'),
                }
            breakdown[key]['total'] += t.amount

        result = sorted(breakdown.values(), key=lambda x: x['total'], reverse=True)
        for item in result:
            item['total'] = float(item['total'])
        return result

    @staticmethod
    def get_current_month_summary(user) -> dict:
        today = date.today()
        return FinanceService.get_monthly_summary(user, today.year, today.month)

    @staticmethod
    def get_pending_installments_for_account(account_id: int) -> dict:
        """Retorna o total das parcelas futuras e o número de meses até a última."""
        today = date.today()
        pending_qs = Transaction.objects.filter(
            account_id=account_id,
            installment_id_group__isnull=False,
            date__gt=today,
        )
        total = pending_qs.aggregate(t=Sum('amount'))['t'] or Decimal('0')
        last_date = (
            pending_qs.order_by('-date').values_list('date', flat=True).first()
        )
        if last_date:
            months = (last_date.year - today.year) * 12 + (last_date.month - today.month)
        else:
            months = 0
        return {
            'pending_installments_amount': float(total),
            'pending_installments_months': months,
        }
