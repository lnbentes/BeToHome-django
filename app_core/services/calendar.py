from datetime import date

from app_core.models import CalendarEvent


class CalendarService:
    @staticmethod
    def get_queryset():
        return CalendarEvent.objects.prefetch_related('participants')

    @staticmethod
    def get_upcoming():
        return (
            CalendarEvent.objects
            .filter(date__gte=date.today())
            .order_by('date', 'time')
            .prefetch_related('participants')
        )

    @staticmethod
    def get_by_month(year: int, month: int):
        return (
            CalendarEvent.objects
            .filter(date__year=year, date__month=month)
            .order_by('date', 'time')
            .prefetch_related('participants')
        )
