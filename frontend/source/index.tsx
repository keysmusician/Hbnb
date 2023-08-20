import 'vite/modulepreload-polyfill'
import './categories.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FilterBar } from './categories';
import { Search } from './search';
import { FilterDialog } from './filtersDialog';
import { searchPlaces } from "../static/scripts/hbnb.js"


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

function setFilters(update: (filters: Filters) => Filters) {
	filters = update(filters);
	searchPlaces(filters)
}

const filter_dialog_root = createRoot(document.getElementById('filter_dialog'))

filter_dialog_root.render(<FilterDialog showDialog={false} setFilters={setFilters} />)

function setShowDialog(showDialog: boolean) {
	filter_dialog_root.render(<FilterDialog showDialog={showDialog} setFilters={setFilters} />);
}

createRoot(document.getElementById('search')!).render(<Search />);

createRoot(document.getElementById('filters')!).render(
	<FilterBar setShowDialog={setShowDialog} setFilters={setFilters} />
);
