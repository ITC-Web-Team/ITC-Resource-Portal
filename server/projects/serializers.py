from rest_framework import serializers

from .models import Project, ProjectReview


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "created_by",
            "title",
            "problem_statement",
            "tentative_timeline",
            "budget_needed",
            "contact_info",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "status",
            "created_at",
            "updated_at",
        ]


class ProjectReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectReview
        fields = [
            "id",
            "project",
            "reviewed_by",
            "approved_budget",
            "approved_timeline",
            "live_deadline",
            "admin_name",
            "admin_email",
            "admin_phone",
            "remarks",
            "reviewed_at",
        ]
        read_only_fields = [
            "id",
            "reviewed_at",
        ]