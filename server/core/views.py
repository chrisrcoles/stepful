import os
import time
import random

from django.conf import settings
from django.http import JsonResponse

from django.views import View
from dotenv import load_dotenv

load_dotenv()


class HomeView(View):
    def get(self, request):
        return JsonResponse({"message": "API"}, status=200)

class HealthCheckView(View):
    def get(self, request):
        now = int(time.time() * 1000)
        uptime = now - settings.START_TIME
        return JsonResponse({
            "status": "ok",
            "uptime": uptime,
            "environment": os.environ["ENVIRONMENT"],
            "random": int(random.random() * 10000000),
        }, status=200)