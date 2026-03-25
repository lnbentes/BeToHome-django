from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from app_core.models import Category, Account, Transaction, Task, Place, CalendarEvent
import datetime

class Command(BaseCommand):
    help = 'Seeds initial mock data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # Users
        u1, _ = User.objects.get_or_create(username='papai', defaults={'first_name': 'Papai'})
        u1.set_password('123456')
        u1.save()
        u2, _ = User.objects.get_or_create(username='mamae', defaults={'first_name': 'Mamãe'})
        u2.set_password('123456')
        u2.save()
        u3, _ = User.objects.get_or_create(username='filho', defaults={'first_name': 'Filho'})
        u3.set_password('123456')
        u3.save()

        admin, _ = User.objects.get_or_create(username='admin', is_staff=True, is_superuser=True)
        admin.set_password('admin')
        admin.save()

        # Accounts
        acc1, _ = Account.objects.get_or_create(name='Carteira', defaults={'balance': 150.00, 'type': 'WALLET', 'color': '#10b981'})
        acc2, _ = Account.objects.get_or_create(name='Itaú', defaults={'balance': 2969.79, 'type': 'BANK', 'color': '#f97316'})
        acc3, _ = Account.objects.get_or_create(name='Nubank', defaults={'balance': 540.50, 'type': 'BANK', 'color': '#8b5cf6'})

        # Categories
        cat1, _ = Category.objects.get_or_create(name='Moradia', defaults={'icon': 'Home', 'color': '#3b82f6', 'type': 'EXPENSE'})
        cat2, _ = Category.objects.get_or_create(name='Alimentação', defaults={'icon': 'Utensils', 'color': '#ef4444', 'type': 'EXPENSE'})
        cat3, _ = Category.objects.get_or_create(name='Transporte', defaults={'icon': 'Car', 'color': '#eab308', 'type': 'EXPENSE'})
        cat4, _ = Category.objects.get_or_create(name='Salário', defaults={'icon': 'Briefcase', 'color': '#22c55e', 'type': 'INCOME'})
        cat5, _ = Category.objects.get_or_create(name='Lazer', defaults={'icon': 'PartyPopper', 'color': '#ec4899', 'type': 'EXPENSE'})

        # Tasks
        Task.objects.get_or_create(title='Regar as plantas', assignee=u1, defaults={'status': 'PENDING', 'due_date': '2024-05-20'})
        Task.objects.get_or_create(title='Pagar conta de luz', assignee=u2, defaults={'status': 'PENDING', 'due_date': '2024-05-21'})

        # Transactions
        Transaction.objects.get_or_create(
            description='Compras do Mercado', 
            defaults={
                'amount': 150.50, 
                'type': 'EXPENSE', 
                'method': 'DEBIT', 
                'category': cat2, 
                'account': acc2, 
                'date': '2024-05-18', 
                'user': u2
            }
        )

        # Places
        Place.objects.get_or_create(
            name='Kyoto, Japão', 
            defaults={
                'location': 'Japão', 
                'image_url': 'https://picsum.photos/id/1015/400/300', 
                'visited': True, 
                'rating': 5, 
                'added_by': u1, 
                'notes': 'Templos incríveis!'
            }
        )

        # Events
        evt1, _ = CalendarEvent.objects.get_or_create(
            title='Jantar em Família', 
            date='2024-05-20',
            defaults={ 'time': '19:00', 'color': 'green' }
        )
        evt1.participants.add(u1, u2, u3)

        self.stdout.write(self.style.SUCCESS('Successfully seeded data'))
