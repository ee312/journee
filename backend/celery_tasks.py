# celery tasks for processing

from celery import Celery # this is the queue dependency

app = Celery(
    name = "tasks",
    broker = "redis://localhost:6379",
    backend = "redis://localhost:6379"
)


@app.task
def user_preferences(user_id, preference): # arguments need to change depending on pass in
    # logic for user pref here; not sure how im going to integrate yet