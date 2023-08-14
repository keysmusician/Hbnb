import React from 'react';
import './search.css';


export function Search() {
	return (
		<div className='search_container'>
			<article className='search_buttons'>
				<button className='anywhere'>
					<div>
						Anywhere
					</div>
				</button>
				<button id='any_week'>
					<div>
						Any week
					</div>
				</button>
				<button className='add_guests'>
					<div>
						Add guests
					</div>
					<span className='search_icon'/>
				</button>
			</article>
		</div>
	)
}
