from django.contrib import admin
from django.urls import include, path
from accounts.views import sso_callback
from accounts.views import my_profile, my_mentor, my_projects
from projects.views import (
    ProjectListCreateView,
    MyProjectListView,
    ProjectDetailView,
    ProjectReviewListCreateView,
    ProjectReviewDetailView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("callback/", sso_callback, name="sso_callback"),

    path("api-auth/", include("rest_framework.urls")),

    path("api/profile/me/", my_profile),
    path("api/profile/mentor/", my_mentor),
    path("api/profile/projects/", my_projects),
    # Projects
    path("api/projects/", ProjectListCreateView.as_view()),
    path("api/projects/my/", MyProjectListView.as_view()),
    path("api/projects/<int:pk>/", ProjectDetailView.as_view()),
    path("api/", include("projects.urls")),

    # Project reviews
    path(
        "api/project-reviews/",
        ProjectReviewListCreateView.as_view(),
    ),
    path(
        "api/project-reviews/<int:pk>/",
        ProjectReviewDetailView.as_view(),
    ),
]
