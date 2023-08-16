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
					<span className='search_icon'>
						<span
							style={{
								"position": "relative",
								"gridArea": "2 / 2 / 2 / 2",
							}}
						>
							<span style={{
								"border": ".12rem solid white",
								"borderRadius": "50%",
								"boxSizing": "border-box",
								"display": "block",
								"height": "80%",
								"width": "80%",
							}} />
							<span style={{
								"borderRight": ".12rem solid white",
								"bottom": "0",
								"boxSizing": "border-box",
								"display": "block",
								"height": "50%",
								"position": "absolute",
								"right": "0",
								"transform": "rotate(-45deg)",
								"transformOrigin": "bottom right",
							}} />
						</span>
					</span>
				</button>
			</article>
		</div>
	)
}
