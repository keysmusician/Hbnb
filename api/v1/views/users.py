#!/usr/bin/python3
"""
Users routes.
"""
from api.v1.views import app_views
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response, request
from models import storage_engine
from models.user import User


@app_views.route('/users', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/all_users.yml')
def get_users():
    """
    Lists all User objects.
    """
    return jsonify([user.to_dict() for user in storage_engine.all(User).values()])


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/get_user.yml', methods=['GET'])
def get_user(user_id):
    """
    Retrieves a User.
    """
    user = storage_engine.get(User, user_id)

    if not user:
        abort(404)

    return jsonify(user.to_dict())


@app_views.route('/users/<user_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/user/delete_user.yml', methods=['DELETE'])
def delete_user(user_id):
    """
    Deletes a User.
    """
    user = storage_engine.get(User, user_id)

    if not user:
        abort(404)

    storage_engine.delete(user)

    storage_engine.save()

    return make_response(jsonify({}), 200)


@app_views.route('/users', methods=['POST'], strict_slashes=False)
@swag_from('documentation/user/post_user.yml', methods=['POST'])
def post_user():
    """
    Creates a User.
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'email' not in request.get_json():
        abort(400, description="Missing email")

    if 'password' not in request.get_json():
        abort(400, description="Missing password")

    data = request.get_json()

    instance = User(**data)

    instance.save()

    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/user/put_user.yml', methods=['PUT'])
def put_user(user_id):
    """
    Updates a User.
    """
    user = storage_engine.get(User, user_id)

    if not user:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'email', 'created_at', 'updated_at']

    data = request.get_json()

    for key, value in data.items():
        if key not in ignore:
            setattr(user, key, value)

    storage_engine.save()

    return make_response(jsonify(user.to_dict()), 200)
