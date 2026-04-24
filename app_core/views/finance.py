import logging
from datetime import date

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from app_core.serializers import CategorySerializer, AccountSerializer, TransactionSerializer
from app_core.services import CategoryService, AccountService, TransactionService, FinanceService

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CategoryService.get_user_queryset(self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AccountService.get_user_queryset(self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        params = self.request.query_params
        year = params.get('year')
        month = params.get('month')
        search = params.get('search')
        min_amount = params.get('min_amount')
        max_amount = params.get('max_amount')
        tx_type = params.get('type')

        return TransactionService.get_filtered_transactions(
            user=self.request.user,
            year=int(year) if year else None,
            month=int(month) if month else None,
            search=search or None,
            min_amount=float(min_amount) if min_amount else None,
            max_amount=float(max_amount) if max_amount else None,
            tx_type=tx_type or None,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = dict(serializer.validated_data)
        installments = int(validated.pop('installments', 1) or 1)

        created = TransactionService.create_with_installments(
            user=request.user,
            data=validated,
            installments=installments,
        )
        result = self.get_serializer(created, many=True)
        return Response(result.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        validated = dict(serializer.validated_data)
        validated.pop('installments', None)  # ignorado em edição
        for attr, value in validated.items():
            setattr(instance, attr, value)
        instance.save()
        logger.info('Transação atualizada: id=%s user=%s', instance.id, request.user.id)
        return Response(self.get_serializer(instance).data)

    @action(detail=False, methods=['get'], url_path='summary')
    def monthly_summary(self, request):
        today = date.today()
        year = int(request.query_params.get('year', today.year))
        month = int(request.query_params.get('month', today.month))
        summary = FinanceService.get_monthly_summary(request.user, year, month)
        breakdown = FinanceService.get_category_breakdown(request.user, year, month)
        return Response({**summary, 'category_breakdown': breakdown})
