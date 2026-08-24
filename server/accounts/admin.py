from django.contrib import admin

from .models import AdminAccess, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "roll_no", "department", "degree", "role", "is_sso_verified")
    list_filter = ("role", "is_sso_verified", "department", "degree")
    search_fields = ("name", "roll_no", "user__username")


@admin.register(AdminAccess)
class AdminAccessAdmin(admin.ModelAdmin):
    list_display = ("roll_no",)
    search_fields = ("roll_no",)
