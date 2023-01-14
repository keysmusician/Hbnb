#!/usr/bin/python3
"""
Places, cities, and search routes.
"""
from api.v1.views import app_views
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response, request
from models import storage_engine
from models.amenity import Amenity
from models.city import City
from models.place import Place
from models.state import State
from models.user import User


@app_views.route(
    '/cities/<city_id>/places', methods=['GET'], strict_slashes=False)
@swag_from('documentation/place/get_places.yml', methods=['GET'])
def get_places(city_id):
    """
    Lists all Place objects of a City.
    """
    city = storage_engine.get(City, city_id)

    if not city:
        abort(404)

    return jsonify([place.to_dict() for place in city.places])


@app_views.route('/places/<place_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/place/get_place.yml', methods=['GET'])
def get_place(place_id):
    """
    Retrieves a Place object.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    return jsonify(place.to_dict())


@app_views.route(
    '/places/<place_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/place/delete_place.yml', methods=['DELETE'])
def delete_place(place_id):
    """
    Deletes a Place object.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    storage_engine.delete(place)

    storage_engine.save()

    return make_response(jsonify({}), 200)


@app_views.route(
    '/cities/<city_id>/places', methods=['POST'], strict_slashes=False)
@swag_from('documentation/place/post_place.yml', methods=['POST'])
def post_place(city_id):
    """
    Creates a Place.
    """
    city = storage_engine.get(City, city_id)

    if not city:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(400, description="Missing user_id")

    data = request.get_json()

    user = storage_engine.get(User, data['user_id'])

    if not user:
        abort(404)

    if 'name' not in request.get_json():
        abort(400, description="Missing name")

    data["city_id"] = city_id

    instance = Place(**data)

    instance.save()

    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/places/<place_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/place/put_place.yml', methods=['PUT'])
def put_place(place_id):
    """
    Updates a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(404)

    data = request.get_json()

    if not data:
        abort(400, description="Not a JSON")

    ignore = ['id', 'user_id', 'city_id', 'created_at', 'updated_at']

    for key, value in data.items():
        if key not in ignore:
            setattr(place, key, value)

    storage_engine.save()

    return make_response(jsonify(place.to_dict()), 200)


@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
@swag_from('documentation/place/post_search.yml', methods=['POST'])
def places_search():
    """
    Retrieves all Place objects matching the search query.
    """
    if request.get_json() is None:
        abort(400, description="Not a JSON")

    data = request.get_json()

    if data and len(data):
        state_ids = data.get('states', None)

        city_ids = data.get('cities', None)

        amenity_ids = data.get('amenities', None)

    # If there were no filters applied, return all places
    if (not data or not len(data) or (
            not state_ids and
            not city_ids and
            not amenity_ids
        )):
        return jsonify(
            [place.to_dict() for place in storage_engine.all(Place).values()])

    list_places = []

    if state_ids:
        states = [
            storage_engine.get(State, state_id) for state_id in state_ids]

        for state in states:
            if state:
                for city in state.cities:
                    if city:
                        for place in city.places:
                            list_places.append(place)

    if city_ids:
        city_obj = [storage_engine.get(City, c_id) for c_id in city_ids]
        for city in city_obj:
            if city:
                for place in city.places:
                    if place not in list_places:
                        list_places.append(place)

    if amenity_ids:
        if not list_places:
            list_places = storage_engine.all(Place).values()

        amenities = [
            storage_engine.get(Amenity, amenity_id)
            for amenity_id in amenity_ids
        ]

        list_places = [
            place for place in list_places if
            all(amenity in place.amenities for amenity in amenities)
        ]

    places = []

    for place in list_places:
        place_dict = place.to_dict()

        place_dict.pop('amenities', None)

        places.append(place_dict)

    return jsonify(places)
