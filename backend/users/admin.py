from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError

from users.models import AppUser

# Register your models here.


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput)

    class Meta:
        model = AppUser
        fields = ["email", "first_name", "last_name"]

    # clean_<field_name> are called automatically to validate data
    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    # Replaces the password field with admin's disabled password hash display field.
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = AppUser
        fields = ["email", "password", "first_name",
                  "last_name", "is_active", "is_admin"]


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    # fields displayed on users list
    list_display = ["email", "first_name", "last_name", "created_at"]

    # Field to filter by
    list_filter = ["is_admin"]

    # Fields to display on change user form
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Personal Info", {"fields": ["first_name", "last_name"]}),
        ("Permissions", {"fields": ["is_admin"]})
    ]

    # Fields to display on create user form
    add_fieldsets = [
        (None,
         {"classes": ["wide"],
          "fields": ["email", "first_name", "last_name", "password1", "password2"]})
    ]

    search_fields = ["email"]
    ordering = ["email", "created_at"]
    filter_horizontal = []


admin.site.register(AppUser, UserAdmin)
