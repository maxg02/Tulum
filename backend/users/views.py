from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from users.models import AppUser
from users.serializers import UserSerializer

# Create your views here.


@api_view(['GET'])
def get_users(request):
    users = AppUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user(request, pk):
    user = AppUser.objects.get(id=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)
