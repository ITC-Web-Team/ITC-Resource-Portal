from django.contrib import admin
from django.urls import include, path

from projects.views import (
    ProjectListCreateView,
    MyProjectListView,
    ProjectDetailView,
    ProjectReviewListCreateView,
    ProjectReviewDetailView,
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api-auth/", include("rest_framework.urls")),

    # Projects
    path("api/projects/", ProjectListCreateView.as_view()),
    path("api/projects/my/", MyProjectListView.as_view()),
    path("api/projects/<int:pk>/", ProjectDetailView.as_view()),

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