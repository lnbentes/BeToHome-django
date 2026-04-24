from django.db import models


class Category(models.Model):
    TYPE_CHOICES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
        ('BOTH', 'Both'),
    ]
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=7)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self.name


class Account(models.Model):
    TYPE_CHOICES = [
        ('BANK', 'Bank'),
        ('WALLET', 'Wallet'),
        ('INVESTMENT', 'Investment'),
    ]
    name = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    color = models.CharField(max_length=7)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
        ('TRANSFER', 'Transfer'),
    ]
    METHOD_CHOICES = [
        ('CREDIT', 'Credit'),
        ('DEBIT', 'Debit'),
        ('CASH', 'Cash'),
        ('INSTALLMENT', 'Installment'),
    ]

    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    method = models.CharField(max_length=15, choices=METHOD_CHOICES)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name='transactions'
    )
    to_account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name='incoming_transfers',
        null=True,
        blank=True,
    )
    date = models.DateField()
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    installment_current = models.IntegerField(null=True, blank=True)
    installment_total = models.IntegerField(null=True, blank=True)
    installment_id_group = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.description
