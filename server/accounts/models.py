from django.conf import settings
from django.db import models


class Profile(models.Model):
    class Role(models.TextChoices):
        USER = "user", "User"
        ADMIN = "admin", "Admin"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    name = models.CharField(max_length=150)
    roll_no = models.CharField(max_length=30, unique=True)
    email = models.EmailField(blank=True)
    department = models.CharField(max_length=100, blank=True)
    degree = models.CharField(max_length=100, blank=True)
    passing_year = models.PositiveSmallIntegerField(blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )
    is_sso_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        # Auto-derive IITB email from roll number if not already set
        if not self.email and self.roll_no:
            self.email = f"{self.roll_no}@iitb.ac.in"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.roll_no})"