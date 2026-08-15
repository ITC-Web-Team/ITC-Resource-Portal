from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="profile",
            old_name="branch",
            new_name="department",
        ),
        migrations.RenameField(
            model_name="profile",
            old_name="year",
            new_name="passing_year",
        ),
        migrations.AddField(
            model_name="profile",
            name="degree",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.RemoveField(
            model_name="profile",
            name="email",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="phone",
        ),
        migrations.RemoveField(
            model_name="profile",
            name="por",
        ),
    ]
