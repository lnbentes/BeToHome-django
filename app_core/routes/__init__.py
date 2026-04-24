from django.urls import path, include

urlpatterns = [
    path('', include('app_core.routes.finance')),
    path('', include('app_core.routes.tasks')),
    path('', include('app_core.routes.places')),
    path('', include('app_core.routes.calendar')),
    path('', include('app_core.routes.auth')),
]
