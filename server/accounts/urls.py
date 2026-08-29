from django.urls import path
from . import views
from .views import (
    sso_login,
    admin_login,
    sso_callback,
    my_profile,
    my_mentor,
    my_projects,
)


urlpatterns = [
    path("login/", views.sso_login, name="sso_login"),
    path("admin-login/", views.admin_login, name="admin_login"),
    path("callback/", views.sso_callback, name="sso_callback"),
    path("check-admin/", views.check_admin, name="check_admin"),
    path("profile/me/", my_profile, name="my_profile"),
    path("profile/mentor/", my_mentor, name="my_mentor"),
    path("profile/projects/", my_projects, name="my_projects"),
]
