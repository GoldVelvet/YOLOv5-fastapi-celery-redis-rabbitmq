FROM pytorch/pytorch:latest
WORKDIR /app
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6 -y
COPY requirements.txt requirements.txt
RUN pip install -U pip
RUN pip install -r requirements.txt
COPY . .
RUN rm -r /app/api/uploads/*; exit 0
RUN rm -r /app/api/static/*; exit 0