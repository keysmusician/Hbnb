import { API_root } from "../static/scripts/api_root.js"


export const api_routes = {
	home: API_root + "status",
	cities: API_root + "cities",
	states: API_root + "states",
	amenities: API_root + "amenities",
	categories: API_root + "categories",
	places: API_root + "places",
	places_search: API_root + "places_search",
}
