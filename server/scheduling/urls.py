from django.urls import path

from .views import SlotsView

urlpatterns = [
    path('slots/', SlotsView.as_view(), name='slots_list'),
    path('slots/<uuid:slot_id>/', SlotsView.as_view(), name='slot_update'),  # New URL
]