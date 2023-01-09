#!/usr/bin/python3
"""
Reviews routes.
"""
from api.v1.views import app_views
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response, request
from models import storage_engine
from models.place import Place
from models.review import Review
from models.user import User


@app_views.route(
    '/places/<place_id>/reviews', methods=['GET'], strict_slashes=False)
@swag_from('documentation/reviews/get_reviews.yml', methods=['GET'])
def get_reviews(place_id):
    """
    Lists all Review objects of a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    return jsonify([review.to_dict() for review in place.reviews])


@app_views.route('/reviews/<review_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/reviews/get_review.yml', methods=['GET'])
def get_review(review_id):
    """
    Retrieves a Review object.
    """
    review = storage_engine.get(Review, review_id)

    if not review:
        abort(404)

    return jsonify(review.to_dict())


@app_views.route(
    '/reviews/<review_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/reviews/delete_reviews.yml', methods=['DELETE'])
def delete_review(review_id):
    """
    Deletes a Review object.
    """

    review = storage_engine.get(Review, review_id)

    if not review:
        abort(404)

    storage_engine.delete(review)

    storage_engine.save()

    return make_response(jsonify({}), 200)


@app_views.route(
    '/places/<place_id>/reviews', methods=['POST'], strict_slashes=False)
@swag_from('documentation/reviews/post_reviews.yml', methods=['POST'])
def post_review(place_id):
    """
    Creates a Review.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(400, description="Missing user_id")

    data = request.get_json()

    user = storage_engine.get(User, data['user_id'])

    if not user:
        abort(404)

    if 'text' not in request.get_json():
        abort(400, description="Missing text")

    data['place_id'] = place_id

    instance = Review(**data)

    instance.save()

    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/reviews/<review_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/reviews/put_reviews.yml', methods=['PUT'])
def put_review(review_id):
    """
    Updates a Review.
    """
    review = storage_engine.get(Review, review_id)

    if not review:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'user_id', 'place_id', 'created_at', 'updated_at']

    data = request.get_json()

    for key, value in data.items():
        if key not in ignore:
            setattr(review, key, value)

    storage_engine.save()

    return make_response(jsonify(review.to_dict()), 200)
