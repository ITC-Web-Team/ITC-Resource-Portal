from django.urls import path
from . import views


urlpatterns = [
    path("login/", views.sso_login, name="sso_login"),
    path("admin-login/", views.admin_login, name="admin_login"),
    path("callback/", views.sso_callback, name="sso_callback"),
]
