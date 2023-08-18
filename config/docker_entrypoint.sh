#!/bin/bash
# This script starts and stops all the services used by Hbnb.

echo "$0: Starting services..."

function startup() {
  service nginx start || nginx -t # Test the Nginx configuration file if it fails to start
  # Start Gunicorn in the background (otherwise the next command won't run)
  if [[ $CONFIGURATION = "development" ]]; then
    ./config/run_frontend_server.sh &
    ./config/run_api_server.sh
  else
    gunicorn --config config/hbnb_frontend_gunicorn.conf.py &
    gunicorn --config config/hbnb_api_gunicorn.conf.py
  fi
}

function shut_down() {
  echo "Shutting down..."
  service nginx stop
  pkill gunicorn
}

# trap "echo 'Caught signal $$'" SIGHUP SIGURG SIGRTMIN+11 SIGINT SIGXCPU SIGRTMIN+12 SIGQUIT SIGXFSZ SIGRTMIN+13 SIGILL SIGVTALRM SIGRTMIN+14 SIGTRAP SIGPROF SIGRTMIN+15 SIGABRT SIGWINCH SIGRTMAX-14 SIGBUS SIGIO SIGRTMAX-13 SIGFPE SIGPWR SIGRTMAX-12 SIGKILL SIGSYS SIGRTMAX-11 SIGUSR1 SIGRTMAX-10 SIGSEGV SIGRTMAX-9 SIGUSR2 SIGRTMIN SIGRTMAX-8 SIGPIPE SIGRTMIN+1 SIGRTMAX-7 SIGALRM SIGRTMIN+2 SIGRTMAX-6 SIGTERM SIGRTMIN+3 SIGRTMAX-5 SIGSTKFLT SIGRTMIN+4 SIGRTMAX-4 SIGCHLD SIGRTMIN+5 SIGRTMAX-3 SIGCONT SIGRTMIN+6 SIGRTMAX-2 SIGSTOP SIGRTMIN+7 SIGRTMAX-1 SIGTSTP SIGRTMIN+8 SIGRTMAX SIGTTIN SIGRTMIN+9 SIGTTOU SIGRTMIN+10

# Safely stop Nginx and gunicorn.
trap shut_down SIGTERM SIGKILL SIGQUIT SIGINT

# Wait for the startup processes to terminate or until a signal stops this script.
startup &

wait
