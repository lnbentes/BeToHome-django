from datetime import date
from decimal import Decimal

from app_core.models import Category, Account, Transaction


class CategoryService:
    @staticmethod
    def get_queryset():
        return Category.objects.all()


class AccountService:
    @staticmethod
    def get_queryset():
        return Account.objects.all()


class TransactionService:
    @staticmethod
    def get_queryset():
        return Transaction.objects.all()

    @staticmethod
    def get_user_transactions(user):
        return Transaction.objects.filter(user=user).select_related('category', 'account')


class FinanceService:
    """Regras de negócio e relatórios financeiros."""

    @staticmethod
    def get_monthly_summary(year: int, month: int) -> dict:
        """Retorna receitas, despesas e saldo para um mês específico."""
        transactions = Transaction.objects.filter(date__year=year, date__month=month)

        income = sum(t.amount for t in transactions if t.type == 'INCOME')
        expense = sum(t.amount for t in transactions if t.type == 'EXPENSE')

        return {
            'income': income or Decimal('0.00'),
            'expense': expense or Decimal('0.00'),
            'balance': (income or Decimal('0.00')) - (expense or Decimal('0.00')),
        }

    @staticmethod
    def get_current_month_summary() -> dict:
        today = date.today()
        return FinanceService.get_monthly_summary(today.year, today.month)
