#!/bin/sh
# This script starts and stops all the services used by Hbnb.

# Safely stop Nginx and gunicorn.
trap '
    service nginx stop
    pkill gunicorn;
' TERM

# Start Nginx and gunicorn in the background.
nginx & \
gunicorn --config config/hbnb_frontend_gunicorn.conf.py & \
gunicorn --config config/hbnb_api_gunicorn.conf.py &

# Wait for the background processes to terminate or until a signal stops this script.
wait
