from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from expenses.models import ExpenseCategory
from expenses.serializers import ExpenseCategorySerializer


class ExpenseCategoryList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        expense_categories = ExpenseCategory.objects.filter(user=user)
        serializer = ExpenseCategorySerializer(expense_categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        serializer = ExpenseCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseCategoryDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            expense_category = ExpenseCategory.objects.get(id=pk)
            return Response(expense_category)
        except:
            return Response("Expense Category doesn't exist", status=status.HTTP_404_NOT_FOUND)

    def put(self, pk, request):
        expense_category = self.get_object(pk)
        serializer = ExpenseCategorySerializer(expense_category, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, pk):
        expense_category = self.get_object(pk)
        expense_category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
