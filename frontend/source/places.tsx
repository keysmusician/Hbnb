import type { Place } from "./index.js"
import { theme } from "./theme.tsx"


interface PlacesProps {
	places: Place[]
}
export function Places({ places }: PlacesProps) {
	return (<>
		{places.map((place) =>
			<Place key={place.id} place={place} />
		)}
	</>)
}

interface PlaceProps {
	place: Place
}
function Place({ place }: PlaceProps) {
	return (
		<a href={`/places/${place.id}`}>
			<article>
				<div className="title_box">
					<h2>{place.name}</h2>
				</div>
				<div className="city">
					<b>{place.city?.name}, {place.state?.name}</b>
				</div>
				<div className="information">
					<div className="max_guest">{place.max_guest} Guest{place.max_guest != 1 ? 's' : ''}</div>
					<div className="number_rooms">{place.number_rooms} Bedroom{place.number_rooms != 1 ? 's' : ''}</div>
					<div className="number_bathrooms">{place.number_bathrooms} Bathroom{place.number_rooms != 1 ? 's' : ''}</div>
				</div>
				<div className="description">
					{place.description}
				</div>
				<div className="price_by_night">
					<b>${place.price_by_night}</b> night
				</div>
			</article>
		</a >
	)
}
