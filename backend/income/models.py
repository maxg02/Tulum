from django.db import models
from users.models import AppUser

# Create your models here.


class Income(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    amount = models.IntegerField()
    details = models.CharField(max_length=25)
    date = models.DateTimeField()


class FixedIncome(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    amount = models.IntegerField()
    details = models.CharField(max_length=25)
    periodicity = models.IntegerField()
