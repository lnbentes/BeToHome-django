from rest_framework.routers import DefaultRouter

from app_core.views.calendar import CalendarEventViewSet

router = DefaultRouter()
router.register(r'events', CalendarEventViewSet, basename='calendarevent')

urlpatterns = router.urls
