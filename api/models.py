from pydantic import BaseModel


class Task(BaseModel):
    task_id: str
    status: str


class Prediction(Task):
    task_id: str
    status: str
    result: str
