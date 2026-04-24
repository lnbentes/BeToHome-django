from app_core.models import Place


class PlaceService:
    @staticmethod
    def get_queryset():
        return Place.objects.select_related('added_by')

    @staticmethod
    def get_by_user(user):
        return Place.objects.filter(added_by=user).select_related('added_by')

    @staticmethod
    def get_unvisited():
        return Place.objects.filter(visited=False).select_related('added_by')
