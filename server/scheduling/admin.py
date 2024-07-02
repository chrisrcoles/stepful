from django.contrib import admin

# Register your models here.
from .models import UserProfile, Slot#, Feedback

admin.site.register(UserProfile)
admin.site.register(Slot)
