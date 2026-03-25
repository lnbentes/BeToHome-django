from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'accounts', views.AccountViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'places', views.PlaceViewSet)
router.register(r'events', views.CalendarEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.api_login, name='api_login'),
    path('auth/logout/', views.api_logout, name='api_logout'),
]
