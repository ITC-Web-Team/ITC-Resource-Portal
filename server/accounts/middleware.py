from django.http import JsonResponse

from .utils import is_admin_user

# Path prefixes that require the logged-in user to be an ITC admin
# (roll number present in AdminAccess). Keep this in sync with the admin-only
# routes actually mounted in projects/urls.py.
ADMIN_ONLY_PATH_PREFIXES = ("/api/requests",)


class AdminOnlyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path.startswith(ADMIN_ONLY_PATH_PREFIXES):

            if not request.user.is_authenticated:
                return JsonResponse(
                    {"detail": "Authentication required."},
                    status=401
                )

            if not is_admin_user(request.user):
                return JsonResponse(
                    {"detail": "You are not an admin."},
                    status=403
                )

        return self.get_response(request)
