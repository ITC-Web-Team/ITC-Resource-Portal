from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "roll_no", "department", "degree", "role", "is_sso_verified")
    list_filter = ("role", "is_sso_verified", "department", "degree")
    search_fields = ("name", "roll_no", "user__username")
