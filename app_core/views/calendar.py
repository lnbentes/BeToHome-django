import logging

from rest_framework import viewsets, permissions

from app_core.models import CalendarEvent
from app_core.serializers import CalendarEventSerializer

logger = logging.getLogger(__name__)


class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated]
