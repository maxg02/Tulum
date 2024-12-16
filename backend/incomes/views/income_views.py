from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from incomes.models import Income
from incomes.serializers import IncomeSerializer


class IncomeList(APIView):

    @method_decorator(login_required)
    def get(self, request):
        user = request.user
        incomes = Income.objects.filter(user=user)
        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data)

    @method_decorator(login_required)
    def post(self):
        user = self.request.user
        serializer = IncomeSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IncomeDetails(APIView):

    @method_decorator(login_required)
    def get_object(self, pk):
        try:
            return Income.objects.get(id=pk)
        except Income.DoesNotExist:
            Response("Income doesn't exists", status=status.HTTP_404_NOT_FOUND)

    @method_decorator(login_required)
    def put(self, request, pk):
        income = self.get_object(pk)
        serializer = IncomeSerializer(income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(login_required)
    def delete(self, request, pk):
        income = self.get_object(pk)
        income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
