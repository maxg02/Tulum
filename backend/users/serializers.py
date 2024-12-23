from users.models import AppUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings


class UserWithTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['full_name'] = user.get_full_name()
        print(user.profile_image)
        token['profile_image'] = str(
            settings.MEDIA_URL) + str(user.profile_image)

        return token


class UserSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = AppUser
        fields = ["id", "email", "first_name",
                  "last_name", "full_name", "password", "profile_image"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = AppUser.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def get_full_name(self, obj):
        return obj.get_full_name()
