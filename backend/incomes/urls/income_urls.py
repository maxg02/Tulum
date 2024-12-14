from django.urls import path
from incomes.views import income_views as views

urlpatterns = [
    path('', views.get_user_incomes, name='user_incomes')
]
