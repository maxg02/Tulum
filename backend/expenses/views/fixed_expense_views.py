from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from expenses.models import FixedExpense
from expenses.serializers import FixedExpenseSerializer


class FixedExpenseList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        fixed_expenses = FixedExpense.objects.filter(category__user=user)
        serializer = FixedExpenseSerializer(fixed_expenses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FixedExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FixedExpenseDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return FixedExpense.objects.get(id=pk)
        except FixedExpense.DoesNotExist:
            return Response("Fixed Expense doesn't exist", status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        fixed_expense = self.get_object(pk)
        serializer = FixedExpenseSerializer(fixed_expense, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        fixed_expense = self.get_object(pk)
        fixed_expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
