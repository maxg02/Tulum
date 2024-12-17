from django.urls import path
from users import views

urlpatterns = [
    path('', views.UsersList.as_view(), name='users'),
    path('<int:pk>', views.UsersDetails.as_view(), name='user')
]
