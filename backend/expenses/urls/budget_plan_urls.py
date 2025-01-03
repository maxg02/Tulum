from django.urls import path
from expenses.views import budget_plan_views as views

urlpatterns = [
    path('', views.BudgetPlanList.as_view()),
    path('<int:pk>', views.BudgetPlanDetails.as_view())
]
