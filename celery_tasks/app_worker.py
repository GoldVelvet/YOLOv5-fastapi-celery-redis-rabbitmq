import os
from celery import Celery

BROKER_URI = 'amqp://rabbitmq'
BACKEND_URI = 'redis://redis'

app = Celery(
    'celery_tasks',
    broker=BROKER_URI,
    backend=BACKEND_URI,
    include=['celery_tasks.tasks']
)
