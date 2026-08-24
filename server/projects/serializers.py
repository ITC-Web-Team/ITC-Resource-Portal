from rest_framework import serializers

from .models import Project, ProjectReview


class ProjectSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.name",
        read_only=True,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "created_by",
            "created_by_name",
            "title",
            "problem_statement",
            "domain",
            "tentative_timeline",
            "team_size",
            "budget_needed",
            "budget_breakdown",
            "contact_info",
            "contact_email",
            "contact_phone",
            "team_lead_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_by_name",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        parts = [
            attrs.get("team_lead_name", "").strip(),
            attrs.get("contact_email", "").strip(),
            attrs.get("contact_phone", "").strip(),
        ]
        attrs["contact_info"] = " | ".join(part for part in parts if part)
        return attrs


class PublicProjectSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.name",
        read_only=True,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "created_by_name",
            "title",
            "problem_statement",
            "domain",
            "tentative_timeline",
            "team_size",
            "budget_needed",
            "budget_breakdown",
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
