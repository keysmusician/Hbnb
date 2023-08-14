import React from "react"


const categories = [
	'Beachfront',
	'Lakefront',
	'Amazing pools',
	'Windmills',
	'Tropical',
	'Mansions',
	'Amazing views',
	'Castles',
	'Boats',
	'Islands',
	'Underground',
	'Underwater',
	'Tiny homes',
	'Treehouses',
	'OMG!',
	'Trending',
	'Luxe',
	'Off the grid',
	'Countryside',
	'Play',
	'Houseboats',
	'Unique stays',
	'Camping',
	'A-frames',
	'Barns',
]

export function FilterBar() {

	const scroll_button_arrow_style = {
		"transform": "rotate(45deg)",
		"margin": "1px",
		"width": "35%",
		"height": "35%",
		"border-bottom": "2px solid black",
		"border-left": "2px solid black",
		"background-color": "transparent",
		"border-radius": "0 2px",
		"box-sizing": "border-box",
	}

	return (
		<article style={{
			"align-items": "center",
			"display": "grid",
			"grid-template-columns": "auto 20px 90px",
			"grid-template-rows": "auto",
			"position": "relative",
			"height": "100%",
			"width": "100%",
			"max-width": "100%",
		}}>
			<div style={{
				"position": "relative",
				"overflow-x": "auto",
			}}>
				<div className="scroll_button_container scroll_previous">
					<button className="scroll_button">
						<div className="scroll_button_arrow" style={scroll_button_arrow_style} />
					</button>
				</div>
				<Categories />
				<div className="scroll_button_container scroll_next ">
					<button className="scroll_button">
						<div className="scroll_button_arrow" style={{
							...scroll_button_arrow_style,
							"transform": "rotate(-135deg)"
						}} />
					</button>
				</div>
			</div>
			<button className="filters_button">
				<img/>
				<div>Filters</div>
			</button>
		</article>
	)
}

function Categories() {
	const [selectedIndex, setSelectedIndex] = React.useState<number| undefined>()

	const categories_elements = categories.map((category, index) => {
		const selected = index === selectedIndex ? "category_selected" : ""

		return <li className={`category ${selected}`} key={index} onClick={() => setSelectedIndex(index)}>
			<span className="category_icon">[Img]</span>
			<span>{category}</span>
		</li>
	})

	return (
		<form className="categories">
			{categories_elements}
		</form>
	)
}
