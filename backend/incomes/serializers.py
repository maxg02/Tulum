from rest_framework import serializers
from incomes.models import Income, FixedIncome


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        exclude = ["user"]


class FixedIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedIncome
        exclude = ["user"]
