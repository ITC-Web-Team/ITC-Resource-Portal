from django.contrib import admin

from .models import Project, ProjectReview


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "status", "budget_needed", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("title", "created_by__name", "created_by__roll_no")


@admin.register(ProjectReview)
class ProjectReviewAdmin(admin.ModelAdmin):
    list_display = ("project", "admin_name", "approved_budget", "live_deadline", "reviewed_at")
    list_filter = ("reviewed_at",)
    search_fields = ("project__title", "admin_name", "admin_email")
