from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from incomes.models import Income
from incomes.serializers import IncomeSerializer


@api_view(['GET'])
def get_user_incomes(request):
    user = request.user
    incomes = Income.objects.filter(user=user)
    serializer = IncomeSerializer(incomes, many=True)
    print(user.id)
    return Response(serializer.data)
