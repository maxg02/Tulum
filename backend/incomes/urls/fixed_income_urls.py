from django.urls import path
from incomes.views import fixed_income_views as views

urlpatterns = [
    path('', views.FixedIncomeList.as_view()),
    path('<int:pk>', views.FixedIncomeDetails.as_view())
]
