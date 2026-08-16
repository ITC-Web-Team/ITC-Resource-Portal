from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import get_user_model, login
import requests

from .models import Profile, AdminAccess


PROJECT_ID = "4b68cd3f-f0d3-4a47-8066-09942cad8e82"

User = get_user_model()


# ------------ STUDENT LOGIN via SSO ------------

def sso_login(request):
    return redirect(
        f"https://sso.tech-iitb.org/project/{PROJECT_ID}/ssocall/"
    )


# ------------ ADMIN LOGIN via SSO ------------

def admin_login(request):
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
    if profile.role == Profile.Role.ADMIN:
        return redirect("http://localhost:3000/admin")

    return redirect("http://localhost:3000")


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
