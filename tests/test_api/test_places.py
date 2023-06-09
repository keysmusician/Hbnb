"""
Tests the Hbnb REST API.
"""
import unittest
from api.v1.app import app
from http import HTTPStatus
import pprint


class TestPlacesSearch(unittest.TestCase):
    """
    Tests the /places_search endpoint of the Hbnb REST API.
    """
    places_search_route = '/api/v1/places_search'


    def setUp(self) -> None:
        """
        Test set up.
        """
        #self.app = app

        #self.app_context = app.app_context()

        #self.app_context.push()

        self.client = app.test_client()


    def test_allowed_methods(self):
        """
        Should return HTTP 405 Method Not Allowed for all request methods
        except for POST and OPTIONS.
        """
        GET_response = self.client.get(self.places_search_route)

        self.assertEqual(GET_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


        HEAD_response = self.client.head(self.places_search_route)

        self.assertEqual(HEAD_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


        DELETE_response = self.client.delete(self.places_search_route)

        self.assertEqual(DELETE_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


        PUT_response = self.client.put(self.places_search_route)

        self.assertEqual(PUT_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


        OPTIONS_response = self.client.options(self.places_search_route)

        self.assertEqual(OPTIONS_response.status_code, HTTPStatus.OK)


        TRACE_response = self.client.trace(self.places_search_route)

        self.assertEqual(TRACE_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


        PATCH_response = self.client.patch(self.places_search_route)

        self.assertEqual(PATCH_response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)


    def test_invalid_json_request(self):
        """
        POST request with invalid JSON should return HTTP 400 Bad Request.
        """
        response = self.client.post(
            self.places_search_route,
            data=bytes("[{}", 'ascii'),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)


    def test_empty_json_list_request(self):
        """
        POST request with a JSON list should return HTTP 422 Unprocessable Entity.
        """
        response = self.client.post(
            self.places_search_route,
            json=[]
        )

        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)

        response = self.client.post(
            self.places_search_route,
            data=bytes("[{}, {}]", 'ascii'),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, HTTPStatus.UNPROCESSABLE_ENTITY)


    def test_empty_json_string_request(self):
        """
        An empty JSON string should return HTTP 422 Unprocessable Entity.
        """
        empty_JSON_string_response = self.client.post(
            self.places_search_route,
            json=''
        )

        self.assertEqual(
            empty_JSON_string_response.status_code,
            HTTPStatus.UNPROCESSABLE_ENTITY
        )


    def test_empty_post_request(self):
        """
        POST request containing no data should return HTTP 400 Bad Request.
        """
        None_response = self.client.post(
            self.places_search_route,
            data=None
        )

        self.assertEqual(None_response.status_code, HTTPStatus.BAD_REQUEST)

        None_response = self.client.post(
            self.places_search_route,
            content_type='application/json'
        )

        self.assertEqual(None_response.status_code, HTTPStatus.BAD_REQUEST)


        # empty_JSON_object_response = self.client.post(
        #     self.places_search_route,
        #     json={}
        # )

        # self.assertEqual(
        #     empty_JSON_object_response.status_code, HTTPStatus.BAD_REQUEST)


    def test_places_search_with_empty_filters(self):
        """
        POST request filtering with empty filters should return a list of places.
        """
        response = self.client.post(
            self.places_search_route,
            json={
                'cities': [],
                'amenities': [],
            }
        )

        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.assertTrue(len(response.json) > 0)

        for place in response.json:

            self.assertEqual(place['__class__'], 'Place')

            for attribute in (
                'amenities',
                'city',
                'created_at',
                'description',
                'id',
                'latitude',
                'longitude',
                'max_guest',
                'name',
                'number_bathrooms',
                'number_rooms',
                'price_by_night',
                'state',
                'updated_at',
                'user',
            ):
                self.assertIsNotNone(place[attribute])


    @unittest.skip
    def test_places_search_with_valid_filter(self):
        """
        POST request filtering on cities should return a list of places in
        only those cities.
        """
        raise NotImplementedError
        response = self.client.post(
            self.places_search_route,
            json={
                'cities': []
            }
        )

        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.assertTrue(len(response.json) > 0)


    def test_places_search_with_valid_filter_and_unknown_filter(self):
        """
        POST request containing unknown keys should ignore the unknown keys
        and still filter on recognized filter keys.
        """
        response = self.client.post(
            self.places_search_route,
            json={
                'cities': [],
                'unknown_filter_key': []
            }
        )

        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.assertTrue(len(response.json) > 0)



