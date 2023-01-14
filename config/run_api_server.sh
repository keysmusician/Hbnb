#!/bin/bash
export FLASK_APP="api/v1/app"
export FLASK_ENV="development"
flask run --host "${HBNB_API_HOST:-0.0.0.0}" --port "${HBNB_API_PORT:-5002}" --extra-files "data/Hbnb_FileStorage.json:frontend/static/styles"
