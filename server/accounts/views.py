from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import get_user_model, login
import requests

from .models import Profile, AdminAccess

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from projects.models import Project

PROJECT_ID = "38da6e30-2b15-43f2-bdf7-41c8e9d12583"

User = get_user_model()


# ------------ STUDENT LOGIN via SSO ------------

def sso_login(request):
    request.session["login_type"] = "user"
    return redirect(
        f"https://sso.tech-iitb.org/project/{PROJECT_ID}/ssocall/"
    )


# ------------ ADMIN LOGIN via SSO ------------

def admin_login(request):
    request.session["login_type"] = "admin"    
    return redirect(
        f"https://sso.tech-iitb.org/project/{PROJECT_ID}/ssocall/"
    )


# ------------ SSO CALLBACK ------------

def sso_callback(request):

    # Get temporary access ID returned by SSO
    session_key = request.GET.get("accessid")

    if not session_key:
        return HttpResponse(
            "Invalid SSO response",
            status=400
        )

    # Get user information from SSO
    user_data = get_user_data(session_key)

    if not user_data:
        return HttpResponse(
            "Unable to fetch user information from SSO",
            status=400
        )

    # Information received from SSO
    roll_no = user_data["roll"]
    name = user_data["name"]
    email = f"{roll_no}@iitb.ac.in"
    login_type = request.session.get("login_type")
    # Check whether this roll number is allowed to access admin page
    is_admin = AdminAccess.objects.filter(
        roll_no=roll_no
    ).exists()

    # Create or update Django User
    user, created = User.objects.update_or_create(
        email=email,
        defaults={
            "username": roll_no,
            "first_name": name,
        }
    )

    # Create or update Profile
    profile, created = Profile.objects.update_or_create(
        user=user,
        defaults={
            "name": name,
            "roll_no": roll_no,
            "email": email,
            "department": user_data.get("department", ""),
            "degree": user_data.get("degree", ""),
            "passing_year": user_data.get("passing_year"),
            "role": (
                Profile.Role.ADMIN
                if is_admin
                else Profile.Role.USER
            ),
            "is_sso_verified": True,
        }
    )

    # Log the user into Django's session
    login(request, user)

    # Store SSO information in session
    request.session["accessid"] = session_key
    request.session["user_data"] = user_data

    # Redirect according to role
    if login_type == "admin":
        if is_admin:
            return redirect("http://127.0.0.1:5173/admin-dashboard")
        else:
            return redirect("http://127.0.0.1:5173/not-admin")

    return redirect("http://127.0.0.1:5173/profile") 
# ------------ GET USER DATA FROM SSO ------------

def get_user_data(session_key):

    try:
        response = requests.post(
            "https://sso.tech-iitb.org/project/getuserdata",
            json={"id": session_key},
            timeout=10,
        )

        if response.status_code != 200:
            return None

        return response.json()

    except requests.RequestException:
        return None

# ------------ CURRENT USER PROFILE ------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_profile(request):
    profile = request.user.profile

    return Response({
        "name": profile.name,
        "initials": "".join(
            word[0] for word in profile.name.split()[:2]
        ).upper(),
        "rollNo": profile.roll_no,
        "branch": profile.degree,
        "year": profile.passing_year,
        "email": profile.email,
        "phone": "",
        "is_sso_verified": profile.is_sso_verified,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_mentor(request):
    profile = request.user.profile

    project = (
        Project.objects
        .filter(created_by=profile)
        .exclude(team_lead_name="")
        .first()
    )

    if not project:
        return Response({
            "name": "",
            "initials": "",
            "role": "",
            "email": "",
            "phone": "",
        })

    mentor_name = project.team_lead_name.strip()

    return Response({
        "name": mentor_name,
        "initials": "".join(
            word[0] for word in mentor_name.split()[:2]
        ).upper(),
        "role": "Team Lead / Mentor",
        "email": project.contact_email,
        "phone": project.contact_phone,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_projects(request):
    profile = request.user.profile

    projects = Project.objects.filter(
        created_by=profile
    )

    data = []

    for project in projects:
        review = getattr(project, "review", None)

        data.append({
            "id": project.id,
            "title": project.title,
            "category": project.domain,
            "deadline": (
                review.live_deadline.strftime("%b %d, %Y")
                if review and review.live_deadline
                else ""
            ),
            "status": project.status.upper(),
            "allotted": (
                f"₹{review.approved_budget:,.0f}"
                if review and review.approved_budget is not None
                else "₹0"
            ),
            "timeline": (
                review.approved_timeline
                if review and review.approved_timeline
                else project.tentative_timeline
            ),
            "period": project.tentative_timeline,
            "progress": 0,
        })

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_admin(request):
    profile = Profile.objects.filter(
        user=request.user
    ).first()

    if not profile:
        return Response({
            "is_admin": False
        })

    is_admin = AdminAccess.objects.filter(
        roll_no=profile.roll_no
    ).exists()

    return Response({
        "is_admin": is_admin
    })
