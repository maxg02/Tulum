from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from expenses.models import BudgetPlan
from expenses.serializers import BudgetPlanSerializer


class BudgetPlanList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        budget_plans = BudgetPlan.objects.filter(category__user=user)
        serializer = BudgetPlanSerializer(budget_plans, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BudgetPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetPlanDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return BudgetPlan.objects.get(id=pk)
        except BudgetPlan.DoesNotExist:
            return Response("Budget Plan doesn't exist", status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        budget_plan = self.get_object(pk)
        serializer = BudgetPlanSerializer(budget_plan, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget_plan = self.get_object(pk)
        budget_plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
