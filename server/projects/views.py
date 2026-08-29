from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from accounts.models import AdminAccess, Profile 


from .models import Project
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Project, ProjectReview
from .serializers import (
    ProjectSerializer,
    ProjectReviewSerializer,
    PublicProjectSerializer,
)

def is_admin_user(user):
    try:
        profile = user.profile
    except Profile.DoesNotExist:
        return False

    return AdminAccess.objects.filter(
        roll_no=profile.roll_no
    ).exists()

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def requests_list(request):

    if not is_admin_user(request.user):
        return JsonResponse(
            {"detail": "You are not an admin."},
            status=403
        )

    status = request.GET.get("status", "pending")
    search = request.GET.get("search", "")

    projects = Project.objects.all()

    if status != "all":
        projects = projects.filter(status=status)

    if search:
        projects = projects.filter(title__icontains=search)

    data = []

    for project in projects:
        data.append({
            "id": project.id,
            "user": project.created_by.name,
            "project": project.title,
            "status": project.get_status_display(),
            "date": project.created_at.strftime("%d/%m/%Y"),
        })

    return JsonResponse(data, safe=False)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def request_details(request, pk):

    if not is_admin_user(request.user):
        return JsonResponse(
            {"detail": "You are not an admin."},
            status=403
        )

    project = get_object_or_404(Project, pk=pk)

    return JsonResponse({
        "id": project.id,
        "title": project.title,
        "problem_statement": project.problem_statement,
        "domain": project.domain,
        "tentative_timeline": project.tentative_timeline,
        "team_size": project.team_size,
        "budget_needed": str(project.budget_needed),
        "budget_breakdown": project.budget_breakdown,
        "contact_info": project.contact_info,
        "contact_email": project.contact_email,
        "contact_phone": project.contact_phone,
        "team_lead_name": project.team_lead_name,
        "status": project.status,
        "created_at": project.created_at.strftime("%d/%m/%Y"),
    })

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def approve_request(request, pk):

    if not is_admin_user(request.user):
        return JsonResponse(
            {"detail": "You are not an admin."},
            status=403
        )

    project = get_object_or_404(Project, pk=pk)

    project.status = Project.Status.APPROVED
    project.save()

    return JsonResponse({
        "message": "Request approved",
        "id": project.id,
        "status": project.status,
    })

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def reject_request(request, pk):

    if not is_admin_user(request.user):
        return JsonResponse(
            {"detail": "You are not an admin."},
            status=403
        )

    project = get_object_or_404(Project, pk=pk)

    project.status = Project.Status.REJECTED
    project.save()

    return JsonResponse({
        "message": "Request rejected",
        "id": project.id,
        "status": project.status,
    })


