#!/bin/bash
export FLASK_APP="frontend/hbnb.py"
export FLASK_ENV="development"
flask run --host "${HBNB_FRONTEND_HOST:-0.0.0.0}" --port "${HBNB_FRONTEND_PORT:-5001}" --extra-files "data/Hbnb_FileStorage.json"
