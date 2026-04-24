import uuid
import logging
from datetime import date
from decimal import Decimal

from django.db.models import Q, Sum

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
        qs = Transaction.objects.filter(user=user).select_related('category', 'account')
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

    @staticmethod
    def create_with_installments(user, data, installments=1):
        """Cria uma transação simples ou N parcelas distribuídas nos meses seguintes."""
        installments = int(installments or 1)

        if installments <= 1:
            transaction = Transaction.objects.create(user=user, **data)
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
                # Ajusta para o último dia do mês se necessário
                import calendar
                last_day = calendar.monthrange(y, m)[1]
                installment_date = base_date.replace(year=y, month=m, day=last_day)

            amount = installment_value + (remainder if i == 0 else Decimal('0'))
            t = Transaction.objects.create(
                user=user,
                description=data['description'],
                amount=amount,
                type=data['type'],
                method='INSTALLMENT',
                category=data.get('category'),
                account=data.get('account'),
                date=installment_date,
                installment_current=i + 1,
                installment_total=installments,
                installment_id_group=group_id,
            )
            created.append(t)

        logger.info('%d parcelas criadas (grupo=%s) user=%s', installments, group_id, user.id)
        return created


class FinanceService:
    """Regras de negócio e relatórios financeiros."""

    @staticmethod
    def get_monthly_summary(user, year: int, month: int) -> dict:
        """Retorna receitas, despesas e saldo para um mês/usuário específico."""
        qs = Transaction.objects.filter(user=user, date__year=year, date__month=month)
        income = qs.filter(type='INCOME').aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
        expense = qs.filter(type='EXPENSE').aggregate(t=Sum('amount'))['t'] or Decimal('0.00')
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
