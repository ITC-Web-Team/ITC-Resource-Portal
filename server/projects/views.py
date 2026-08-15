from rest_framework import generics, permissions

from .models import Project, ProjectReview
from .serializers import ProjectSerializer, ProjectReviewSerializer


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.profile)


class MyProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(
            created_by=self.request.user.profile
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectReviewListCreateView(generics.ListCreateAPIView):
    queryset = ProjectReview.objects.all()
    serializer_class = ProjectReviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectReview.objects.all()
    serializer_class = ProjectReviewSerializer
    permission_classes = [permissions.IsAuthenticated]