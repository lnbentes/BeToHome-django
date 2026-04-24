
from django.contrib import admin

from app_core.models import Category, Account, Transaction, Task, Place, CalendarEvent


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'icon', 'color')
    list_filter = ('type',)
    search_fields = ('name',)


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'balance', 'color')
    list_filter = ('type',)
    search_fields = ('name',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('description', 'type', 'method', 'amount', 'date', 'account', 'user')
    list_filter = ('type', 'method', 'date')
    search_fields = ('description',)
    date_hierarchy = 'date'
    raw_id_fields = ('user', 'account', 'to_account', 'category')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'assignee', 'due_date')
    list_filter = ('status',)
    search_fields = ('title',)
    date_hierarchy = 'due_date'


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'visited', 'rating', 'added_by')
    list_filter = ('visited',)
    search_fields = ('name', 'location')
    raw_id_fields = ('added_by',)


@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'time', 'color')
    list_filter = ('date',)
    search_fields = ('title',)
    date_hierarchy = 'date'

