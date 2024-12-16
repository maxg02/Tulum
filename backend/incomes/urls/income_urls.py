from django.urls import path
from incomes.views import income_views as views

urlpatterns = [
    path('', views.IncomeList.as_view()),
    path('<int:pk>', views.IncomeDetails.as_view())
]
