#!/usr/bin/python3
"""
Amenities routes.
"""
from api.v1.views import app_views
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response, request
from models import storage_engine
from models.amenity import Amenity


@app_views.route('/amenities', methods=['GET'], strict_slashes=False)
@swag_from('documentation/amenity/all_amenities.yml')
def get_amenities():
    """
    Lists all amenities.
    """
    all_amenities = storage_engine.all(Amenity).values()

    return jsonify([amenity.to_dict() for amenity in all_amenities])


@app_views.route(
    '/amenities/<amenity_id>/', methods=['GET'], strict_slashes=False)
@swag_from('documentation/amenity/get_amenity.yml', methods=['GET'])
def get_amenity(amenity_id):
    """
    Retrieves an amenity.
    """
    amenity = storage_engine.get(Amenity, amenity_id)

    if not amenity:
        abort(404)

    return jsonify(amenity.to_dict())


@app_views.route(
    '/amenities/<amenity_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/amenity/delete_amenity.yml', methods=['DELETE'])
def delete_amenity(amenity_id):
    """
    Deletes an amenity.
    """
    amenity = storage_engine.get(Amenity, amenity_id)

    if not amenity:
        abort(404)

    storage_engine.delete(amenity)

    storage_engine.save()

    return make_response(jsonify({}), 200)


@app_views.route('/amenities', methods=['POST'], strict_slashes=False)
@swag_from('documentation/amenity/post_amenity.yml', methods=['POST'])
def post_amenity():
    """
    Creates an amenity.
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'name' not in request.get_json():
        abort(400, description="Missing name")

    data = request.get_json()

    instance = Amenity(**data)

    instance.save()

    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route(
    '/amenities/<amenity_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/amenity/put_amenity.yml', methods=['PUT'])
def put_amenity(amenity_id):
    """
    Updates an amenity.
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    amenity = storage_engine.get(Amenity, amenity_id)

    if not amenity:
        abort(404)

    data = request.get_json()

    for key, value in data.items():
        if key not in ignore:
            setattr(amenity, key, value)

    storage_engine.save()

    return make_response(jsonify(amenity.to_dict()), 200)
