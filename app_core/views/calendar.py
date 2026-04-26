import logging

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from app_core.serializers import CalendarEventSerializer
from app_core.services import CalendarService

logger = logging.getLogger(__name__)


class CalendarEventViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CalendarService.get_queryset()

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        events = CalendarService.get_upcoming()
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
