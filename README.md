# YOLO v5 object detection end-to-end with FastAPI, Celery, Redis, RabbitMQ and Containers

This repository show the code created to be as a "template" to deploy applications with containers using FastAPI, Celery, Redis and RabbitMQ.

As a demo application, it was build a API service using [YOLO v5](https://github.com/ultralytics/yolov5) to perform object detection.

Since Yolo is a deep model which may take some time to return results, we will use Celery, Redis and RabbitMQ to control the tasks in background.
- [FastAPI](https://fastapi.tiangolo.com): high performance python framework for building APIs.
- [Celery](https://celeryproject.org): A Task Queue with focus on real-time processing, while also supporting task scheduling.
- [RabbitMQ](https://www.rabbitmq.com): A message broker used to route messages between API and the workers from Celery.
- [Redis](https://redis.io): An in-memory database to store results and process status from the tasks.

The image below ilustrate the data flow from all components.
<img src=img/schema.jpg>


# Overview of the code
- [api/app.py](api/app.py): expose the endpoints and send the request task to celery.
- [celery_tasks/tasks.py](celery_tasks/tasks.py): receive the task and send (enqueue) to workers process.
- [celery_tasks/yolo.py](celery_tasks/yolo.py): code to initilize and expose a method receive a picture and return the predictions.


# Services available
| Endpoint | Method | Description
| --- | --- | --- |
| http://localhost:8000/api/process | POST | Send one or more pictures to be processed by Yolo. Return the task_id of each task.
| http://localhost:8000/api/status/<task_id>  | GET  | Retrieve the status of a given task
| http://localhost:8000/api/result/<task_id>    | GET  | Retrieve the results of a given task
| http://localhost:8000/docs   | GET  | Documentation generated for each endpoint
| http://localhost:15672   | GET  | RabbitMQ monitor. User: guest     Password: guest.
| http://localhost   | GET  | Simple webapp to show how to use and display results from the API.



### POST: /api/process
Input

Form with enctype=multipart/form-data and imagens in attribute files. See the example in Ajax.

```javascript
var form_data = new FormData();
files = $('#input_file_form').prop('files')
for (i = 0; i < files.length; i++)
    form_data.append('files', $('#input_file_form').prop('files')[i]);

$.ajax({
    url: URL + '/api/process',
    type: "post",
    data: form_data,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    cache: false,
}).done(function (jsondata, textStatus, jqXHR) {
    console.log(jsondata)

}).fail(function (jsondata, textStatus, jqXHR) {
    console.log(jsondata)

});
``` 

Output: 
```json
[
  {
    "task_id": "2b593c5c-3f0b-49c1-a145-ad613f4ecda5",
    "status": "PROCESSING",
    "url_result": "/api/result/2b593c5c-3f0b-49c1-a145-ad613f4ecda5"
  }
]
```

Using CURL
```bash
curl -X POST "http://localhost:8000/api/process" -H  "accept: application/json" -H  "Content-Type: multipart/form-data" -F "files=@image.jpg;type=image/jpeg"
```

### GET: /api/status/<task_id>
Input
```
task_uid
``` 

Output: 
```json
{
  "task_id": "2b593c5c-3f0b-49c1-a145-ad613f4ecda5",
  "status": "PROCESSING",
  "result": ""
}
```

Using CURL
```bash
curl -X GET "http://localhost/api/status/ren123/"
``` 

### GET: /api/results/<task_id>
Input
``` 
task_id
```
Output (if it is done):
```json
{
  "task_id": "2b593c5c-3f0b-49c1-a145-ad613f4ecda5",
  "status": "SUCCESS",
  "result": {
    "file_name": "static/f5956eea.jpg",
    "bbox": [
      {
        "x": "0.4734227",
        "y": "0.63320345",
        "w": "0.76526415",
        "h": "0.7137341",
        "prob": "0.8920207",
        "class": "person"
      },
      {
        "x": "0.3752669",
        "y": "0.8009622",
        "w": "0.07171597",
        "h": "0.38714227",
        "prob": "0.89087594",
        "class": "tie"
      },
      {
        "x": "0.8268833",
        "y": "0.6996484",
        "w": "0.11784973",
        "h": "0.5577593",
        "prob": "0.28665677",
        "class": "tie"
      }
    ]
  }
}
```
If it is processing:
```json
{
  "task_id": "2b593c5c-3f0b-49c1-a145-ad613f4ecda5",
  "status": "PROCESSING",
  "result": ""
}
```


# Install
1. Clone this repository
```bash
git clone https://github.com/renatoviolin/Deploying-YOLOv5-fastapi-celery-redis-rabbitmq.git
cd Deploying-YOLOv5-fastapi-celery-redis-rabbitmq
```

2. Install [docker](https://www.docker.com/get-started). If you already have, create the container with the command:
```bash
docker-compose build
```

3. Run all containers
```bash
docker-compose up
```
This will start:
- rabbitmq: message broker
- redis: in-memory database
- worker: application logic (Yolo model, FastAPI and Celery)
- webapp: demo application


4. Perform some requests using the integrated Swagger UI.
http://localhost:8000/docs
<img src=img/doc.gif>


5. Open the demo webapp.
http://localhost/
<img src=img/webapp.gif>

