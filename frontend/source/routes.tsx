export const api_routes = {
	home: "status",
	cities: "cities",
	states: "states",
	amenities: "amenities",
	categories: "categories",
	places: "places",
	places_search: "places_search",
}

for (const key in api_routes) {
	let API_root = '/api/'

	if (import.meta.env.DEV) {
		/**
		 * The API's root URL when in a development environment. It is not needed
		 * in production. Set this to the local API server's host and port.
		 * //TODO: Get the host and port from the environment.
		 **/
		// Hosted via Docker:
		API_root = 'http://localhost:8000/api/'

		// Hosted via Flask development server (make sure the port matches):
		// const API_root = 'http://localhost:5002/api/v1/'

	}

	api_routes[key] = API_root + api_routes[key]
}
