from django.db import models


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

    class Meta:
        verbose_name = 'Account'
        verbose_name_plural = 'Accounts'
        ordering = ['name']

    def __str__(self):
        return self.name
