import json
import logging

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse, HttpResponseBadRequest
from django.core.exceptions import ValidationError

from .models import Slot, UserProfile

logger = logging.getLogger(__name__)


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class SlotsView(View):
    # Coach - Available slots
    def get_available_slots(self, slots):
        available_slots = []
        for slot in slots.exclude(student__isnull=False).filter(start_time__gt=timezone.now()).all():
            coach_phone_number = slot.coach.phone_number.__str__()

            available_slots.append({
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'coach_name': slot.coach.user.username if slot.coach else None,
                'coach_phone_number': coach_phone_number,
            })
        return available_slots

    # Coach - Upcoming booked slots
    def get_upcoming_coaching_slots(self, slots):
        upcoming_coaching_slots = []
        for slot in slots.exclude(student__isnull=True).filter(start_time__gt=timezone.now()).all():
            student_phone_number = slot.student.phone_number.__str__() if slot.student else None
            upcoming_coaching_slots.append({
                'id': slot.id,
                'student_id': slot.student.id if slot.student else None,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'student_name': slot.student.user.username if slot.student else None,
                'student_phone_number': student_phone_number
            })
        return upcoming_coaching_slots

    # Coach - Past slots
    def get_past_coaching_slots(self, slots):
        past_coaching_slots = []
        for slot in slots.exclude(student__isnull=True).filter(end_time__lt=timezone.now()).all():
            past_coaching_slots.append({
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'student_name': slot.student.user.username if slot.student else None,
                'feedback_notes': slot.notes,
                'feedback_satisfaction': slot.satisfaction
            })
        return past_coaching_slots

    # Student - Upcoming booked slots
    def get_upcoming_tutoring_slots(self, slots):
        upcoming_coaching_slots = []
        for slot in slots.filter(start_time__gt=timezone.now()).all():
            student_phone_number = slot.student.phone_number.__str__() if slot.student else None
            coach_phone_number = slot.coach.phone_number.__str__() if slot.coach else None

            upcoming_coaching_slots.append({
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'student_name': slot.student.user.username if slot.student else None,
                'coach_name': slot.coach.user.username if slot.coach else None,
                'student_phone_number': student_phone_number,
                'coach_phone_number': coach_phone_number
            })
        return upcoming_coaching_slots

    # Student - Available slots
    def get_available_student_slots(self, slots):
        available_student_slots = []
        for slot in slots:
            coach_phone_number = slot.coach.phone_number.__str__() if slot.coach else None
            available_student_slots.append({
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'student_name': slot.student.user.username if slot.student else None,
                'coach_name': slot.coach.user.username if slot.coach else None,
                'coach_phone_number': coach_phone_number,
            })
        return available_student_slots

    def get(self, request):
        logger.log(logging.INFO, 'Slots GET')
        coach_id = request.GET.get('coach')
        student_id = request.GET.get('student')

        if not coach_id and not student_id:
            return HttpResponseBadRequest("Missing required fields: coach_id or student_id")

        if coach_id:
            slots = Slot.objects.select_related('student', 'coach').filter(coach_id=coach_id).all()

            available_slots = self.get_available_slots(slots)
            upcoming_coaching_slots = self.get_upcoming_coaching_slots(slots)
            past_coaching_slots = self.get_past_coaching_slots(slots)

            return JsonResponse({
                "data": {
                    # students / coaches
                    "available_slots": available_slots,
                    # coaches
                    "upcoming_coaching_slots": upcoming_coaching_slots,
                    # students
                    "upcoming_tutoring_slots": [],
                    # coaches (as of now) but should be for students also
                    "past_coaching_slots": past_coaching_slots,
                }
            }, status=200)

        if student_id:
            available_student_slots = Slot.objects.filter(start_time__gt=timezone.now()).exclude(student__isnull=False).all()
            available_slots = self.get_available_student_slots(available_student_slots)

            slots = Slot.objects.select_related('student', 'coach').filter(student_id=student_id).all()
            upcoming_tutorial_slots = self.get_upcoming_tutoring_slots(slots)
            past_coaching_slots = self.get_past_coaching_slots(slots)

            return JsonResponse({
                "data": {
                    # students / coaches
                    "available_slots": available_slots,
                    # coaches
                    "upcoming_coaching_slots": [],
                    # students
                    "upcoming_tutoring_slots": upcoming_tutorial_slots,
                    # coaches (as of now) but should also be for students also in the future
                    "past_coaching_slots": past_coaching_slots,
                }
            }, status=200)


    # Creates a new slot - only coach_id is required
    def post(self, request):
        logger.log(logging.INFO, 'Slots POST')

        try:
            data = json.loads(request.body)

            coach_id = data.get('coach_id')
            start_time = data.get('start_time')
            end_time = data.get('end_time')

            if not all([coach_id, start_time, end_time]):
                return HttpResponseBadRequest("Missing required fields")

            logger.log(logging.INFO, 'Creating slots for coach {}'.format(coach_id))

            slot = Slot.objects.create(
                coach_id=coach_id,
                start_time=start_time,
                end_time=end_time,
            )

            slot_data = {
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
            }

            return JsonResponse(slot_data, status=201)
        except json.JSONDecodeError:
            logger.error("Invalid JSON format")
            return HttpResponseBadRequest("Invalid JSON")
        except ValidationError as e:
            logger.error(f"Validation error: {e}")
            return HttpResponseBadRequest(f"Validation error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return JsonResponse({'error': f"Internal server error: {e}"}, status=500)


    # Updates an existing slot, optional update for `student_id`, `satisfaction`, `notes`
    def put(self, request, slot_id):
        logger.log(logging.INFO, 'Slots PUT')

        slot = get_object_or_404(Slot, pk=slot_id)

        if not slot_id:
            return HttpResponseBadRequest("Missing required field: slot_id")

        try:
            data = json.loads(request.body)

            student_id = data.get('student_id')
            satisfaction = data.get('satisfaction')
            notes = data.get('notes')

            if student_id is not None:
                student = get_object_or_404(UserProfile, pk=student_id)
                slot.student = student

            if satisfaction is not None:
                slot.satisfaction = satisfaction

            if notes is not None:
                slot.notes = notes

            slot.save()

            slot_data = {
                'id': slot.id,
                'coach_id': slot.coach_id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'student_id': slot.student_id,
                'satisfaction': slot.satisfaction,
                'notes': slot.notes,
            }

            return JsonResponse(slot_data, status=200)
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except ValidationError as e:
            return HttpResponseBadRequest(f"Validation error: {e}")
        except Exception as e:
            return JsonResponse({'error': f"Internal server error: {e}"}, status=500)
