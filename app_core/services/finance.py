from datetime import date
from decimal import Decimal

from app_core.models import Transaction


class FinanceService:
    """Regras de negócio relacionadas a finanças."""

    @staticmethod
    def get_monthly_summary(year: int, month: int) -> dict:
        """Retorna receitas, despesas e saldo para um mês específico."""
        transactions = Transaction.objects.filter(date__year=year, date__month=month)

        income = sum(
            t.amount for t in transactions if t.type == 'INCOME'
        )
        expense = sum(
            t.amount for t in transactions if t.type == 'EXPENSE'
        )

        return {
            'income': income or Decimal('0.00'),
            'expense': expense or Decimal('0.00'),
            'balance': (income or Decimal('0.00')) - (expense or Decimal('0.00')),
        }

    @staticmethod
    def get_current_month_summary() -> dict:
        today = date.today()
        return FinanceService.get_monthly_summary(today.year, today.month)
