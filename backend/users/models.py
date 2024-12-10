from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.


class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"

    def __str__(self):
        return self.email
