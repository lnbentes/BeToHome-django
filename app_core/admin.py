
from django.contrib import admin
from app_core.models import Category, Account, Transaction, Task, Place, CalendarEvent

admin.site.register(Category)
admin.site.register(Account)
admin.site.register(Transaction)
admin.site.register(Task)
admin.site.register(Place)
admin.site.register(CalendarEvent)
