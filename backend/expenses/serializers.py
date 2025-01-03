from rest_framework import serializers
from expenses.models import BudgetPlan, Expense, ExpenseCategory, FixedExpense


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


class FixedExpenseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        many=False, queryset=ExpenseCategory.objects.all(), read_only=False)

    class Meta:
        model = FixedExpense
        fields = ['id', 'amount', 'details', 'periodicity', 'category']


class BudgetPlanSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        many=False, queryset=ExpenseCategory.objects.all(), read_only=False)

    class Meta:
        model = BudgetPlan
        fields = ["id", "amount", "category", "periodicity"]
