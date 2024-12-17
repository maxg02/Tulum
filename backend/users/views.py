from django.shortcuts import render
from rest_framework.response import Response
from users.models import AppUser
from users.serializers import UserSerializer
from rest_framework import status, permissions
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.


class UsersList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid:
            serializer.save()
            Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return AppUser.objects.get(id=pk)
        except AppUser.DoesNotExist:
            Response("Income doesn't exists", status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
