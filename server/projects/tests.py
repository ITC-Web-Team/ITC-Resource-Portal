from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Profile
from .models import Project


User = get_user_model()


class ProjectApiTests(APITestCase):
    def create_user_with_profile(self, *, username, email, roll_no, name):
        user = User.objects.create_user(
            username=username,
            email=email,
            password="secret123",
        )
        profile = Profile.objects.create(
            user=user,
            name=name,
            roll_no=roll_no,
            email=email,
        )
        return user, profile

    def setUp(self):
        self.owner_user, self.owner_profile = self.create_user_with_profile(
            username="owner",
            email="owner@example.com",
            roll_no="24D0001",
            name="Owner User",
        )
        self.other_user, self.other_profile = self.create_user_with_profile(
            username="other",
            email="other@example.com",
            roll_no="24D0002",
            name="Other User",
        )
        self.approved_project = Project.objects.create(
            created_by=self.owner_profile,
            title="Approved Project",
            problem_statement="Useful public project",
            domain="AI / ML",
            tentative_timeline="3 months",
            budget_needed=Decimal("25000.00"),
            status=Project.Status.APPROVED,
        )
        self.pending_project = Project.objects.create(
            created_by=self.other_profile,
            title="Pending Project",
            problem_statement="Still under review",
            domain="Robotics",
            tentative_timeline="6 months",
            budget_needed=Decimal("40000.00"),
            status=Project.Status.PENDING,
        )

    def test_public_list_only_shows_public_projects(self):
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.approved_project.id)

    def test_authenticated_user_can_create_project(self):
        self.client.force_authenticate(user=self.owner_user)

        response = self.client.post(
            "/api/projects/",
            {
                "title": "New Submission",
                "problem_statement": "Detailed idea",
                "domain": "Software",
                "tentative_timeline": "2 months",
                "team_size": 4,
                "budget_needed": "18000.00",
                "budget_breakdown": "Cloud credits and hardware",
                "contact_email": "lead@example.com",
                "contact_phone": "9999999999",
                "team_lead_name": "Lead Student",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        project = Project.objects.get(title="New Submission")
        self.assertEqual(project.created_by, self.owner_profile)
        self.assertEqual(project.team_size, 4)
        self.assertEqual(
            project.contact_info,
            "Lead Student | lead@example.com | 9999999999",
        )

    def test_non_owner_cannot_update_project(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.patch(
            f"/api/projects/{self.approved_project.id}/",
            {"title": "Hijacked"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
