from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from incomes.models import FixedIncome
from incomes.serializers import FixedIncomeSerializer


class FixedIncomeList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        fixed_incomes = FixedIncome.objects.filter(user=user)
        serializer = FixedIncomeSerializer(fixed_incomes, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        serializer = FixedIncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FixedIncomeDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return FixedIncome.objects.get(id=pk)
        except FixedIncome.DoesNotExist:
            Response("FixedIncome doesn't exists",
                     status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        fixed_income = self.get_object(pk)
        serializer = FixedIncomeSerializer(fixed_income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        fixed_income = self.get_object(pk)
        fixed_income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
