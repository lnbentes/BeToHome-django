from django.db import models


class Place(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    image_url = models.URLField(max_length=1000)
    visited = models.BooleanField(default=False)
    rating = models.IntegerField(null=True, blank=True)  # 1-5
    notes = models.TextField(null=True, blank=True)
    added_by = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
