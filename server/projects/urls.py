from django.urls import path
from . import views

urlpatterns = [
    # keep your existing paths here

    path("requests", views.requests_list, name="requests-list"),
    path("requests/<int:pk>", views.request_details, name="request-details"),
    path(
        "requests/<int:pk>/approve",
        views.approve_request,
        name="approve-request"
    ),
    path(
        "requests/<int:pk>/reject",
        views.reject_request,
        name="reject-request"
    ),
]
