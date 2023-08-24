#!/usr/bin/python3
"""
Places, cities, and search routes.
"""
from api.v1.views import app_views
from enum import Enum
from flasgger.utils import swag_from
from flask import abort, jsonify, make_response, request
from http import HTTPStatus
from models import storage_engine
from models.city import City
from models.place import Place
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
        abort(HTTPStatus.NOT_FOUND)

    return jsonify([place.to_dict() for place in city.places])


@app_views.route('/places/<place_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/place/get_place.yml', methods=['GET'])
def get_place(place_id):
    """
    Retrieves a Place object.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(HTTPStatus.NOT_FOUND)

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
        abort(HTTPStatus.NOT_FOUND)

    storage_engine.delete(place)

    storage_engine.save()

    return make_response(jsonify({}), HTTPStatus.OK)


@app_views.route(
    '/cities/<city_id>/places', methods=['POST'], strict_slashes=False)
@swag_from('documentation/place/post_place.yml', methods=['POST'])
def post_place(city_id):
    """
    Creates a Place.
    """
    city = storage_engine.get(City, city_id)

    if not city:
        abort(HTTPStatus.NOT_FOUND)

    if not request.get_json():
        abort(HTTPStatus.BAD_REQUEST, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(HTTPStatus.BAD_REQUEST, description="Missing user_id")

    data = request.get_json()

    user = storage_engine.get(User, data['user_id'])

    if not user:
        abort(HTTPStatus.NOT_FOUND)

    if 'name' not in request.get_json():
        abort(HTTPStatus.BAD_REQUEST, description="Missing name")

    data["city_id"] = city_id

    instance = Place(**data)

    instance.save()

    return make_response(jsonify(instance.to_dict()), HTTPStatus.CREATED)


@app_views.route('/places/<place_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/place/put_place.yml', methods=['PUT'])
def put_place(place_id):
    """
    Updates a Place.
    """
    place = storage_engine.get(Place, place_id)

    if not place:
        abort(HTTPStatus.NOT_FOUND)

    data = request.get_json()

    if not data:
        abort(HTTPStatus.BAD_REQUEST, description="Not a JSON")

    ignore = ['id', 'user_id', 'city_id', 'created_at', 'updated_at']

    for key, value in data.items():
        if key not in ignore:
            setattr(place, key, value)

    storage_engine.save()

    return make_response(jsonify(place.to_dict()), HTTPStatus.OK)


@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
@swag_from('documentation/place/post_search.yml', methods=['POST'])
def places_search():
    """
    Retrieves all Place objects matching the search query.
    """
    class Filter(Enum):
        states = 'state_IDs'
        cities = 'city_IDs'
        amenities = 'amenity_IDs'
        category = 'category_ID'
        price_min = 'price_min'
        price_max = 'price_max'
        bedroom_count = 'bedroom_count'
        bathroom_count = 'bathroom_count'
        guest_count = 'guest_count'

    search_query = request.get_json(silent=True)

    if search_query is None:
        abort(HTTPStatus.BAD_REQUEST, 'Not a JSON')
    elif type(search_query) != dict:
        abort(HTTPStatus.UNPROCESSABLE_ENTITY)
    elif not len(search_query):
        abort(
            HTTPStatus.BAD_REQUEST,
            description="Missing filters. Request must contain at least one of "
            f"the filter keys: {[filter.value for filter in Filter]}"
        )

    (
        state_ids,
        city_ids,
        amenity_ids,
        category_id,
        price_min,
        price_max,
        bedroom_count,
        bathroom_count,
        guest_count,
    ) = (search_query.get(filter.value, None) for filter in Filter)

    all_places = list(storage_engine.all(Place).values())

    list_places = [
        place for place in all_places if (
            not state_ids or place.city.state_id in state_ids
        ) and (
            not city_ids or place.city_id in city_ids
        ) and (
            not category_id or place.category_id == category_id
        ) and (
            not amenity_ids or all(
                amenity_id in place.amenity_ids for amenity_id in amenity_ids
            )
        ) and (
            price_min is None or place.price_by_night >= price_min
        ) and (
            price_max is None or place.price_by_night <= price_max
        ) and (
            not bedroom_count or place.number_rooms == bedroom_count
        ) and (
            not bathroom_count or place.number_bathrooms == bathroom_count
        ) and (
            not guest_count or place.max_guest == guest_count
        )
    ]

    places = []

    for place in list_places:
        place_dict = place.to_dict()

        place_dict['amenities'] = [
            amenity.to_dict() for amenity in place.amenities]

        place_dict.pop('amenity_ids', None)

        place_dict['category'] = place.category.to_dict()

        place_dict.pop('category_id', None)

        place_dict['city'] = place.city.to_dict()

        place_dict.pop('city_id', None)

        place_dict['state'] = place.city.state.to_dict()

        place_dict.pop('state_id', None)

        place_dict['user'] = place.user.to_dict()

        place_dict.pop('user_id', None)

        places.append(place_dict)

    return places
