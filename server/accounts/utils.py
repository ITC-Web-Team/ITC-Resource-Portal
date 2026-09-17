from .models import AdminAccess, Profile


def is_admin_user(user):
    """Single source of truth for 'is this logged-in user an ITC admin'."""
    if not user or not user.is_authenticated:
        return False

    try:
        profile = user.profile
    except Profile.DoesNotExist:
        return False

    return AdminAccess.objects.filter(roll_no=profile.roll_no).exists()
