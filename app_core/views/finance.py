import logging

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from app_core.serializers import CategorySerializer, AccountSerializer, TransactionSerializer
from app_core.services import CategoryService, AccountService, TransactionService, FinanceService

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CategoryService.get_queryset()


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AccountService.get_queryset()


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TransactionService.get_user_transactions(self.request.user)

    @action(detail=False, methods=['get'], url_path='summary')
    def monthly_summary(self, request):
        summary = FinanceService.get_current_month_summary()
        return Response(summary)
