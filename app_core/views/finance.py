import json
import logging
from datetime import date

from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from app_core.serializers import CategorySerializer, AccountSerializer, TransactionSerializer
from app_core.services import CategoryService, AccountService, TransactionService, FinanceService, FinanceDataService

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
        updated = TransactionService.update_transaction(instance, validated)
        return Response(self.get_serializer(updated).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        TransactionService.delete_transaction(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='summary')
    def monthly_summary(self, request):
        today = date.today()
        year = int(request.query_params.get('year', today.year))
        month = int(request.query_params.get('month', today.month))
        summary = FinanceService.get_monthly_summary(request.user, year, month)
        breakdown = FinanceService.get_category_breakdown(request.user, year, month)
        return Response({**summary, 'category_breakdown': breakdown})

    # ── Exportação ────────────────────────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='export')
    def export_data(self, request):
        """
        Exporta dados financeiros como arquivo JSON para download.
        Query params: account_ids (lista separada por vírgula), year, month.
        """
        params = request.query_params
        raw_ids = params.get('account_ids', '')
        account_ids = [int(i) for i in raw_ids.split(',') if i.strip().isdigit()] or None
        year = int(params['year']) if params.get('year') else None
        month = int(params['month']) if params.get('month') else None

        data = FinanceDataService.export_data(
            user=request.user,
            account_ids=account_ids,
            year=year,
            month=month,
        )
        filename_parts = ['financeiro']
        if year:
            filename_parts.append(str(year))
        if month:
            filename_parts.append(str(month).zfill(2))
        filename = '_'.join(filename_parts) + '.json'

        response = HttpResponse(
            json.dumps(data, ensure_ascii=False, indent=2),
            content_type='application/json',
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    # ── Importação ────────────────────────────────────────────────────────────

    @action(detail=False, methods=['post'], url_path='import')
    def import_data(self, request):
        """
        Importa dados financeiros a partir de um payload JSON.

        Formatos aceitos:
          1. Multipart com campo 'file' (.json gerado pelo export)
          2. Body JSON com o formato completo: { accounts, categories, transactions }
          3. Body JSON com apenas transações: { transactions: [...] }
          4. Body JSON como array direto de transações: [{...}, {...}]
        """
        # ── Leitura do payload ─────────────────────────────────────────────
        if request.FILES.get('file'):
            try:
                raw = json.loads(request.FILES['file'].read())
            except (json.JSONDecodeError, UnicodeDecodeError) as exc:
                return Response({'error': f'Arquivo JSON inválido: {exc}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            raw = request.data

        # ── Normalização: array direto → wrapper padrão ────────────────────
        if isinstance(raw, list):
            payload = {'accounts': [], 'categories': [], 'transactions': raw}
        elif isinstance(raw, dict):
            payload = raw
        else:
            return Response(
                {'error': 'Payload inválido. Envie um objeto JSON ou um array de transações.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = FinanceDataService.import_data(user=request.user, payload=payload)
        return Response(result, status=status.HTTP_200_OK)

    # ── Exclusão em lote ──────────────────────────────────────────────────────

    @action(detail=False, methods=['delete'], url_path='bulk-delete')
    def bulk_delete(self, request):
        """
        Exclui transações em lote.
        Body JSON: { account_ids: [], year: int|null, month: int|null }
        """
        body = request.data
        raw_ids = body.get('account_ids') or []
        account_ids = [int(i) for i in raw_ids if str(i).isdigit()] or None
        year = int(body['year']) if body.get('year') else None
        month = int(body['month']) if body.get('month') else None

        result = FinanceDataService.delete_bulk(
            user=request.user,
            account_ids=account_ids,
            year=year,
            month=month,
        )
        return Response(result, status=status.HTTP_200_OK)
