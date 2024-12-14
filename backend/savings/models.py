from django.db import models
from users.models import AppUser

# Create your models here.


class SavingGoal(models.Model):
    details = models.CharField(max_length=50)
    goal = models.IntegerField()
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)


class GoalContribution(models.Model):
    amount = models.IntegerField()
    savingGoal = models.ForeignKey(SavingGoal, on_delete=models.CASCADE)
    date = models.DateTimeField()
