#!/usr/bin/python3
"""
API index.
"""
from api.v1.views import app_views
from flask import jsonify
from models import storage_engine
from models.amenity import Amenity
from models.city import City
from models.place import Place
from models.review import Review
from models.state import State
from models.user import User


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """
    Returns the API status.
    """
    return jsonify({"status": "OK"})


@app_views.route('/summary', methods=['GET'], strict_slashes=False)
def number_objects():
    """
    Returns the number of saved instances of each model.
    """
    models = [Amenity, City, Place, Review, State, User]

    model_counts = {}

    for model in models:
        model_counts[model.__name__] = storage_engine.count(model)

    return jsonify(model_counts)
