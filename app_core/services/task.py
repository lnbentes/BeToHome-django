from app_core.models import Task


class TaskService:
    @staticmethod
    def get_queryset():
        return Task.objects.select_related('assignee')

    @staticmethod
    def get_pending():
        return Task.objects.filter(status='PENDING').select_related('assignee')

    @staticmethod
    def mark_complete(task_id: int) -> Task:
        task = Task.objects.get(pk=task_id)
        task.status = 'COMPLETED'
        task.save(update_fields=['status'])
        return task
