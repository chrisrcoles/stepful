from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
import uuid


class UserProfile(models.Model):
    STUDENT = 'student'
    COACH = 'coach'

    USER_TYPE_CHOICES = [
        (STUDENT, 'Student'),
        (COACH, 'Coach'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    phone_number = PhoneNumberField(unique=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'user_type'], name='unique_user_type')
        ]

    def __str__(self):
        return f'Username: {self.user_type}, Phone: {self.phone_number}'


class Slot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    student = models.ForeignKey(UserProfile, related_name='booked_slots', null=True, blank=True, on_delete=models.SET_NULL)

    coach = models.ForeignKey(UserProfile, related_name='coaching_slots', on_delete=models.CASCADE)

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    satisfaction = models.IntegerField(null=True, blank=True)

    notes = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(end_time__gt=models.F('start_time')), name='check_start_time_before_end_time')
        ]

    def __str__(self):
        return f'Slot from {self.start_time} to {self.end_time}'