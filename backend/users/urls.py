from django.urls import path
from users import views

urlpatterns = [
    path('', views.get_users, name='users'),
    path('<int:pk>', views.get_user, name='user')
]
