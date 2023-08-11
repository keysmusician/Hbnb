# syntax=docker/dockerfile:1
FROM python:3.8
WORKDIR /app
COPY api api
COPY config config
COPY frontend frontend
# Change API root URL to deployment host:
RUN echo "export const API_root = 'https://hbnb.fly.dev/api/'" > frontend/static/scripts/api_root.js
COPY models models
COPY data/Hbnb_FileStorage.json data/Hbnb_FileStorage.json
COPY requirements.txt .
RUN pip install --requirement requirements.txt
RUN apt-get -y update; apt-get -y upgrade; apt-get -y install nginx
RUN ./config/setup_web_static.sh
ENV HBNB_TYPE_STORAGE='file'
# This should match [[services]] > internal_port in fly.toml and the Hbnb site's Nginx configuration:
EXPOSE 8080
CMD ./config/docker_entrypoint.sh
