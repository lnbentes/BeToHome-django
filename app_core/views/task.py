import logging

from rest_framework import viewsets, permissions

from app_core.serializers import TaskSerializer
from app_core.services import TaskService

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskService.get_queryset()
