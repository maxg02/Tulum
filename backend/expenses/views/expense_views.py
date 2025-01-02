from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from expenses.models import Expense, ExpenseCategory
from expenses.serializers import ExpenseSerializer


class ExpenseList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        expenses = Expense.objects.filter(category__user=user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            expense = Expense.objects.get(id=pk)
            return Response(expense)
        except:
            return Response("Expense doesn't exist", status=status.HTTP_404_NOT_FOUND)

    def put(self, pk, request):
        expense = self.get_object(pk)
        serializer = ExpenseSerializer(expense, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, pk):
        expense = self.get_object(pk)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
