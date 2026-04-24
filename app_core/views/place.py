import logging

from rest_framework import viewsets, permissions

from app_core.models import Place
from app_core.serializers import PlaceSerializer

logger = logging.getLogger(__name__)


class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    permission_classes = [permissions.IsAuthenticated]
