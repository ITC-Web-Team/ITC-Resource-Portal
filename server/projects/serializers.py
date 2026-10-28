from datetime import date

from rest_framework import serializers

from .models import Project, ProjectReview

MAX_BUDGET = 20000

REQUIRED_FIELDS = [
    "title",
    "problem_statement",
    "objective",
    "scope",
    "expected_outcome",
    "motivation",
    "domain",
    "tentative_timeline",
    "end_date",
    "team_size",
    "budget_needed",
    "budget_breakdown",
    "contact_email",
    "contact_phone",
    "team_lead_name",
]


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
            "objective",
            "scope",
            "expected_outcome",
            "motivation",
            "domain",
            "tentative_timeline",
            "end_date",
            "team_size",
            "needs_room",
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
            "contact_info",
            "status",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            field: {"required": True, "allow_null": False}
            for field in REQUIRED_FIELDS
        }

    def get_fields(self):
        fields = super().get_fields()
        for name in REQUIRED_FIELDS:
            if isinstance(fields[name], serializers.CharField):
                fields[name].allow_blank = False
        return fields

    def validate_end_date(self, value):
        if value <= date.today():
            raise serializers.ValidationError("End date must be in the future.")
        return value

    def validate_budget_needed(self, value):
        if value <= 0 or value > MAX_BUDGET:
            raise serializers.ValidationError(
                f"Budget must be between 1 and {MAX_BUDGET:,}."
            )
        return value

    def validate(self, attrs):
        def current(field):
            if field in attrs:
                return attrs[field]
            return getattr(self.instance, field, "") if self.instance else ""

        parts = [
            current("team_lead_name").strip(),
            current("contact_email").strip(),
            current("contact_phone").strip(),
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
            "admin_roll_no",
            "admin_email",
            "admin_phone",
            "remarks",
            "reviewed_at",
        ]
        read_only_fields = [
            "id",
            "reviewed_at",
        ]
