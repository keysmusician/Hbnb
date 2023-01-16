#!/usr/bin/python3
"""
Routes for place amenities.
"""
from api.v1.views import app_views
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response
from models import storage_engine
from models.amenity import Amenity
from models.place import Place


@app_views.route(
    'places/<place_id>/amenities', methods=['GET'], strict_slashes=False)
@swag_from('documentation/place_amenity/get_places_amenities.yml',
           methods=['GET'])
def get_place_amenities(place_id):
    """
    Lists all Amenity objects of a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    return jsonify([amenity.to_dict() for amenity in place.amenities])


@app_views.route('/places/<place_id>/amenities/<amenity_id>',
                 methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/place_amenity/delete_place_amenities.yml',
           methods=['DELETE'])
def delete_place_amenity(place_id, amenity_id):
    """
    Deletes an Amenity of a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    amenity = storage_engine.get(Amenity, amenity_id)

    if not amenity:
        abort(404)

    if amenity not in place.amenities:
        abort(404)

    place.amenities.remove(amenity)

    storage_engine.save()

    return make_response(jsonify({}), 200)


@app_views.route('/places/<place_id>/amenities/<amenity_id>', methods=['POST'],
    strict_slashes=False)
@swag_from('documentation/place_amenity/post_place_amenities.yml',
    methods=['POST'])
def post_place_amenity(place_id, amenity_id):
    """
    Links an Amenity object to a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    amenity = storage_engine.get(Amenity, amenity_id)

    if not amenity:
        abort(404)

    if amenity in place.amenities:
        return make_response(jsonify(amenity.to_dict()), 200)
    else:
        place.amenities.append(amenity)

    storage_engine.save()

    return make_response(jsonify(amenity.to_dict()), 201)
