import logging

from rest_framework import viewsets, permissions

from app_core.serializers import PlaceSerializer
from app_core.services import PlaceService

logger = logging.getLogger(__name__)


class PlaceViewSet(viewsets.ModelViewSet):
    serializer_class = PlaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PlaceService.get_queryset()
