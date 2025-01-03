from rest_framework import serializers
from expenses.models import Expense, ExpenseCategory


class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        many=False, queryset=ExpenseCategory.objects.all(), read_only=False)

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'details', 'date', 'category']


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        exclude = ['user']
