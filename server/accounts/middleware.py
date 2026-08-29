from django.http import JsonResponse

from .models import AdminAccess


class AdminOnlyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Only protect admin API URLs
        if request.path.startswith("/api/admin/"):

            # User must be logged in
            if not request.user.is_authenticated:
                return JsonResponse(
                    {"detail": "Authentication required."},
                    status=401
                )

            # Get user's profile
            try:
                profile = request.user.profile
            except Exception:
                return JsonResponse(
                    {"detail": "Profile not found."},
                    status=403
                )

            # Check AdminAccess table
            is_admin = AdminAccess.objects.filter(
                roll_no=profile.roll_no
            ).exists()

            if not is_admin:
                return JsonResponse(
                    {"detail": "You are not an admin."},
                    status=403
                )

        return self.get_response(request)
