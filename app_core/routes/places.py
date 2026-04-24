from rest_framework.routers import DefaultRouter

from app_core.views.place import PlaceViewSet

router = DefaultRouter()
router.register(r'places', PlaceViewSet, basename='place')

urlpatterns = router.urls
