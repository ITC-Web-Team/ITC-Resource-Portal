from django.db import models


class Project(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        LIVE = "live", "Live"

    created_by = models.ForeignKey(
        "accounts.Profile",
        on_delete=models.CASCADE,
        related_name="projects",
    )
    title = models.CharField(max_length=255)
    problem_statement = models.TextField()
    domain = models.CharField(max_length=120, blank=True)
    tentative_timeline = models.CharField(max_length=120)
    team_size = models.PositiveSmallIntegerField(blank=True, null=True)
    budget_needed = models.DecimalField(max_digits=12, decimal_places=2)
    budget_breakdown = models.TextField(blank=True)
    contact_info = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    team_lead_name = models.CharField(max_length=150, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ProjectReview(models.Model):
    project = models.OneToOneField(
        Project,
        on_delete=models.CASCADE,
        related_name="review",
    )
    reviewed_by = models.ForeignKey(
        "accounts.Profile",
        on_delete=models.SET_NULL,
        related_name="project_reviews",
        blank=True,
        null=True,
    )
    approved_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
    )
    approved_timeline = models.CharField(max_length=120, blank=True)
    live_deadline = models.DateField(blank=True, null=True)
    # NOTE: admin_name/email/phone are stored separately as a "snapshot"
    # in case the reviewing admin's profile changes later. If you'd rather
    # always pull live data from reviewed_by.name / reviewed_by.email,
    # you can remove these three fields.
    admin_name = models.CharField(max_length=150)
    admin_email = models.EmailField(blank=True)
    admin_phone = models.CharField(max_length=20, blank=True)
    remarks = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-reviewed_at"]

    def __str__(self):
        return f"Review for {self.project.title}"
