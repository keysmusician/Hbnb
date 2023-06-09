#!/bin/bash
export FLASK_APP="frontend/hbnb.py"
export FLASK_DEBUG="1"
export FLASK_RUN_EXTRA_FILES="data/Hbnb_FileStorage.json:frontend/static/scripts/hbnb.js"
flask run --host "${HBNB_FRONTEND_HOST:-0.0.0.0}" --port "${HBNB_FRONTEND_PORT:-5001}"
