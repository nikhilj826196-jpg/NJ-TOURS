import os
from celery import Celery

# Fetch Redis broker URL from environment variables
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "nj_tours_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks.background_tasks"]
)

# Optional configuration settings
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)
