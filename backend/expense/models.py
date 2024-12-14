from django.db import models
from users.models import AppUser

# Create your models here.


class ExpenseCategory(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    category = models.CharField(max_length=25, unique=True)


class Expense(models.Model):
    amount = models.IntegerField()
    details = models.CharField(max_length=50)
    date = models.DateTimeField()
    category = models.ForeignKey(
        ExpenseCategory, on_delete=models.SET_NULL, null=True)


class FixedExpense(models.Model):
    amount = models.IntegerField()
    details = models.CharField(max_length=50)
    periodicity = models.IntegerField()
    category = models.ForeignKey(
        ExpenseCategory, on_delete=models.SET_NULL, null=True)


class BudgetPlan(models.Model):
    amount = models.IntegerField()
    category = models.OneToOneField(ExpenseCategory, on_delete=models.CASCADE)
    periodicity = models.IntegerField()
