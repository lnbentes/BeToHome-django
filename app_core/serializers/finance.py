from rest_framework import serializers
from app_core.models import Category, Account, Transaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'type']
        read_only_fields = ['id']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'balance', 'type', 'color', 'icon']
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    category_color = serializers.CharField(source='category.color', read_only=True, allow_null=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True, allow_null=True)
    account_name = serializers.CharField(source='account.name', read_only=True)
    account_color = serializers.CharField(source='account.color', read_only=True)
    account_icon = serializers.CharField(source='account.icon', read_only=True)
    # Campo write-only para indicar quantas parcelas criar
    installments = serializers.IntegerField(write_only=True, required=False, min_value=1, max_value=60, default=1)

    class Meta:
        model = Transaction
        fields = [
            'id', 'description', 'amount', 'type', 'method',
            'category', 'account', 'to_account', 'date',
            'installment_current', 'installment_total', 'installment_id_group',
            'category_name', 'category_color', 'category_icon',
            'account_name', 'account_color', 'account_icon',
            'installments',
        ]
        read_only_fields = [
            'id', 'installment_current', 'installment_total', 'installment_id_group',
        ]
