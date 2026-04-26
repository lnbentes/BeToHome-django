from django.db import models


class CalendarEvent(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    participants = models.ManyToManyField('auth.User', blank=True)
    color = models.CharField(max_length=20, default='green')

    def __str__(self):
        return f"{self.title} - {self.date}"
