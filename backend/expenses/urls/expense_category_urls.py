from django.urls import path
from expenses.views import expense_category_views as views

urlpatterns = [
    path('', views.ExpenseCategoryList.as_view()),
    path('<int:pk>', views.ExpenseCategoryDetails.as_view())
]
