import 'vite/modulepreload-polyfill'
import './categories.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FilterBar } from './categories';
import { SearchBar } from './search';
import { FilterDialog } from './filtersDialog';
import { searchPlaces } from "../static/scripts/hbnb.js"
import { API_root } from "../static/scripts/api_root.js"


export interface Filters {
	amenity_IDs?: string[]
	category_ID?: string
	city_IDs?: string[]
	state_IDs?: string[]
	price_max?: number
	price_min?: number
	bedroom_count?: number
	bathroom_count?: number
}

export const api_routes = {
	home: API_root + "status",
	cities: API_root + "cities",
	states: API_root + "states",
	amenities: API_root + "amenities",
	categories: API_root + "categories",
	places: API_root + "places",
	places_search: API_root + "places_search",
}


let filters: Filters = {
	category_ID: "",
}

function setFilters(update: (filters: Filters) => Filters) {
	filters = update(filters);
	searchPlaces(filters)
}

const filter_dialog_root = createRoot(document.getElementById('filter_dialog'))

filter_dialog_root.render(<FilterDialog showDialog={false} setFilters={setFilters} />)

function setShowDialog(showDialog: boolean) {
	filter_dialog_root.render(<FilterDialog showDialog={showDialog} setFilters={setFilters} />);
}

createRoot(document.getElementById('search')!).render(
	<SearchBar setFilters={setFilters} />
);

createRoot(document.getElementById('filters')!).render(
	<FilterBar setShowDialog={setShowDialog} setFilters={setFilters} />
);
