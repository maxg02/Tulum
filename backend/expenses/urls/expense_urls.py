from django.urls import path
from expenses.views import expense_views as views

urlpatterns = [
    path('', views.ExpenseList.as_view()),
    path('<int:pk>', views.ExpenseDetails.as_view())
]
