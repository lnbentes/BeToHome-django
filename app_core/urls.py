from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app_core.views import (
    UserViewSet,
    CategoryViewSet,
    AccountViewSet,
    TransactionViewSet,
    TaskViewSet,
    PlaceViewSet,
    CalendarEventViewSet,
    api_login,
    api_logout,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'places', PlaceViewSet)
router.register(r'events', CalendarEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', api_login, name='api_login'),
    path('auth/logout/', api_logout, name='api_logout'),
]
