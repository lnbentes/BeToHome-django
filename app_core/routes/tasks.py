from rest_framework.routers import DefaultRouter

from app_core.views.task import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = router.urls
