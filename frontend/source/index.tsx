import 'vite/modulepreload-polyfill'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FilterBar } from './categories.tsx';
import { SearchBar } from './search.tsx';
import { FilterDialog } from './filtersDialog.tsx';
import { Places } from './places.js';
import { api_routes } from './routes.js';


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


let filters: Filters = {
	category_ID: "",
}


export interface Place {
	id: number,
	name: string,
	city: {
		name: string,
	},
	state: {
		name: string,
	},
	max_guest: number,
	number_rooms: number,
	number_bathrooms: number,
	description: string,
	price_by_night: number,
}

function setFilters(update: (filters: Filters) => Filters) {
	filters = update(filters);
	renderPlacesSearch(filters)
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

const places_root = createRoot(document.getElementById('places')!);

function getPlaces(filters) {
	return fetch(api_routes.places_search, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(filters)
	}).then((response) => response.json())
}

function renderPlacesSearch(filters: Filters) {
	getPlaces(filters).then((places) => {
		places_root.render(<Places places={places} />)
	})
}
