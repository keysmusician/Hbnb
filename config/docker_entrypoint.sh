#!/bin/bash
# This script starts and stops all the services used by Hbnb.

echo "$0: Starting services..."

function startup() {
	service nginx start
	# Start Gunicorn in the background (otherwise the next command won't run)
	gunicorn --config config/hbnb_frontend_gunicorn.conf.py &
	gunicorn --config config/hbnb_api_gunicorn.conf.py &
}

function shut_down() {
	echo "Shutting down..."
	service nginx stop
	pkill gunicorn
}

# Safely stop Nginx and gunicorn.
trap shut_down SIGTERM SIGKILL SIGQUIT SIGINT

startup

# Wait for the startup processes to terminate or until a signal stops this script.
wait
