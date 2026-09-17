from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import get_user_model, login
from django.views.decorators.csrf import ensure_csrf_cookie
import requests

from .models import Profile, AdminAccess
from .utils import is_admin_user

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from projects.models import Project

User = get_user_model()


def _sso_call_url():
    return f"{settings.SSO_BASE_URL}/project/{settings.SSO_PROJECT_ID}/ssocall/"


# ------------ STUDENT LOGIN via SSO ------------

def sso_login(request):
    request.session["login_type"] = "user"
    return redirect(_sso_call_url())


# ------------ ADMIN LOGIN via SSO ------------

def admin_login(request):
    request.session["login_type"] = "admin"
    return redirect(_sso_call_url())


# ------------ SSO CALLBACK ------------

@ensure_csrf_cookie
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
    roll_no = user_data.get("roll")
    name = user_data.get("name")

    if not roll_no or not name:
        return HttpResponse(
            "SSO response missing required user fields",
            status=400
        )

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
            return redirect(f"{settings.FRONTEND_URL}/admin-dashboard")
        else:
            return redirect(f"{settings.FRONTEND_URL}/not-admin")

    return redirect(f"{settings.FRONTEND_URL}/profile")
# ------------ GET USER DATA FROM SSO ------------

def get_user_data(session_key):

    try:
        response = requests.post(
            f"{settings.SSO_BASE_URL}/project/getuserdata",
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

 # ------------ CURRENT USER logout ------------
def logout_view(request):
    logout(request)

    response = JsonResponse({
        "message": "Logged out successfully"
    })

    # Clear Django session cookie
    response.delete_cookie("sessionid")

    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_mentor(request):
    profile = request.user.profile

    # The mentor is the admin who approved this user's first project - set
    # once (see projects.views.approve_request) and fixed from then on,
    # even if later projects are reviewed by a different admin. Not the
    # student-entered team lead (see Project.team_lead_name, shown
    # separately on each project card).
    mentor_profile = profile.mentor

    if not mentor_profile:
        return Response({
            "name": "",
            "initials": "",
            "role": "",
            "rollNo": "",
            "email": "",
            "phone": "",
        })

    mentor_name = mentor_profile.name.strip()

    return Response({
        "name": mentor_name,
        "initials": "".join(
            word[0] for word in mentor_name.split()[:2]
        ).upper() if mentor_name else "",
        "role": "Admin / Mentor",
        "rollNo": mentor_profile.roll_no,
        "email": mentor_profile.email,
        "phone": "",
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
            "teamLead": project.team_lead_name,
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

    return Response({
        "is_admin": is_admin_user(request.user)
    })