from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Project, ProjectReview
from .serializers import (
    ProjectSerializer,
    ProjectReviewSerializer,
    PublicProjectSerializer,
)


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.select_related("created_by").all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PublicProjectSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.select_related("created_by").all()

        if self.request.user.is_authenticated:
            return queryset

        return queryset.filter(
            status__in=[
                Project.Status.APPROVED,
                Project.Status.LIVE,
            ]
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.profile)


class MyProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.select_related("created_by").filter(
            created_by=self.request.user.profile
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.select_related("created_by").all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PublicProjectSerializer
        return ProjectSerializer

    def get_object(self):
        project = super().get_object()

        if self.request.method != "GET":
            if project.created_by.user_id != self.request.user.id:
                raise PermissionDenied(
                    "You can only modify projects you created."
                )

        elif not self.request.user.is_authenticated:
            if project.status not in {
                Project.Status.APPROVED,
                Project.Status.LIVE,
            }:
                raise PermissionDenied(
                    "This project is not publicly available."
                )

        return project


class ProjectReviewListCreateView(generics.ListCreateAPIView):
    queryset = ProjectReview.objects.all()
    serializer_class = ProjectReviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectReview.objects.all()
    serializer_class = ProjectReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
