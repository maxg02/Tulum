from django.urls import path
from expenses.views import fixed_expense_views as views

urlpatterns = [
    path('', views.FixedExpenseList.as_view()),
    path('<int:pk>', views.FixedExpenseDetails.as_view())
]
