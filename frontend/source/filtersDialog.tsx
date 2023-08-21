import { useEffect, useRef, useState } from "react";
import { theme } from "./theme";
import { Filters } from ".";
import { api_routes } from "./routes";


interface Amenity {
	id: string;
	name: string;
}

async function fetchAmenities() {
	//TODO: Error handling
	return fetch(api_routes.amenities).then((response) => response.json())
}

interface FilterDialogProps {
	showDialog: boolean;
	setFilters: (update: (filters: Filters) => Filters) => void;
}
export function FilterDialog({ showDialog, setFilters }: FilterDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const dialogPositionBoxRef = useRef<HTMLDivElement>(null);

	const [amenities, setAmenities] = useState<Amenity[]>([])

	const animation_duration = 300

	const fade_modal_options: KeyframeAnimationOptions = {
		duration: animation_duration,
		fill: "forwards",
		easing: "ease-in-out",
	}

	const radio_options_count = 8

	const closeModal = () => {
		if (!dialogRef.current) return
		document.documentElement.style.overflowY = "scroll"
		dialogPositionBoxRef.current?.animate(
			{ transform: ["translateY(0)", "translateY(100vh)"] },
			fade_modal_options
		).finished.then((animation) => animation.cancel())
		dialogRef.current.animate(
			{ opacity: 0 }, fade_modal_options
		).finished.then(() => dialogRef.current.close())
	}

	if (showDialog && dialogRef.current) {
		dialogRef.current.showModal()
		document.documentElement.style.overflowY = "hidden"
		dialogRef.current.focus()
		dialogRef.current.animate(
			{
				opacity: [0, 1],
			}, fade_modal_options
		)
		dialogPositionBoxRef.current?.animate(
			{
				transform: ["translateY(100vh)", "translateY(0)"],
			}, fade_modal_options
		).finished.then((a) => a.cancel())
	} else {
		closeModal()
	}

	useEffect(() => {
		fetchAmenities().then((amenities) => setAmenities(amenities))
	}, [])

	const [
		amenities_name,
		bedroom_count_name,
		bed_count_name,
		bathroom_count_name
	] = ["Amenities", "Bedrooms", "Beds", "Bathrooms"]

	return <dialog
		ref={dialogRef}
		css={{
			backgroundColor: "rgba(0, 0, 0, .55)",
			border: "none",
			minHeight: "100vh",
			minWidth: "100vw",
			margin: 0,
			padding: 0,
			overflowY: "clip",
			"::backdrop": { display: "none" }
		}}
		onClick={closeModal}
	>
		<div
			ref={dialogPositionBoxRef}
			css={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				width: "100vw",
			}}
		>
			<section
				css={{
					backgroundColor: theme.colors.background,
					borderRadius: theme.border.radiusPrimary,
					display: "flex",
					flexDirection: "column",
					margin: "auto",
					padding: "1rem",
					width: "55vw",
					maxHeight: "60vh"
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<header css={{
					display: "flex",
					alignItems: "center",
				}}>
					<CloseFilterDialogButton
						onClick={closeModal}
					/>
					<p css={{
						fontWeight: "bold",
						justifySelf: "center"
					}}>
						Filters
					</p>
				</header>
				<div
					css={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						maxHeight: "100%",
						overflowY: "auto",
					}}
				>
					<FilterArticle title="Price range">
						<div
							css={{
								display: "flex",
								justifyContent: "left",
								alignItems: "center",
							}}
						>
							<input
								id="price_min"
								max="1500"
								min="0"
								placeholder="min"
								type="number"
							/>
							<p>-</p>
							<input
								id="price_max"
								max="1500"
								min="0"
								placeholder="max"
								type="number"
							/>
							<p>$</p>
						</div>
					</FilterArticle>

					<FilterArticle title="Rooms and beds">
						<RadioArticle title={bedroom_count_name} count={radio_options_count} />
						{/* <RadioArticle title={bed_count_name} count={radio_options_count} /> */}
						<RadioArticle title={bathroom_count_name} count={radio_options_count} />
					</FilterArticle>

					<FilterArticle title="Amenities">
						<Amenities items={amenities} name={amenities_name} />
					</FilterArticle>
				</div>
				<footer
					css={{
						display: "flex",
						justifyContent: "flex-end",
						borderTop: theme.border.create(),
					}}
				>
					<FormSubmitButton title="Apply"
						onClick={() => {
							setFilters((filters) => {
								const price_min = (document.getElementById("price_min") as HTMLInputElement).value
								const price_max = (document.getElementById("price_max") as HTMLInputElement).value
								const amenity_IDs = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name=${amenities_name}]:checked`)).map((input) => input.value)
								const bedroom_count = (document.querySelector<HTMLInputElement>(`input[name=${bedroom_count_name}]:checked`) as HTMLInputElement)?.value
								// const bed_count = (document.querySelector<HTMLInputElement>(`input[name=${bed_count_name}]:checked`) as HTMLInputElement)?.value
								const bathroom_count = (document.querySelector<HTMLInputElement>(`input[name=${bathroom_count_name}]:checked`) as HTMLInputElement)?.value
								return {
									...filters,
									amenity_IDs: amenity_IDs.length ? amenity_IDs : undefined,
									bedroom_count: bedroom_count ? parseInt(bedroom_count) : undefined,
									// bed_count: bed_count ? parseInt(bed_count) : undefined,
									bathroom_count: bathroom_count ? parseInt(bathroom_count) : undefined,
									price_min: price_min ? parseInt(price_min) : undefined,
									price_max: price_max ? parseInt(price_max) : undefined,
								}
							})

							closeModal()
						}}
					/>
				</footer>
			</section>
		</div>
	</dialog>
}

function CloseFilterDialogButton({ onClick }: { onClick: () => void }) {
	return <button
		css={{
			backgroundColor: "transparent",
			borderRadius: "50%",
			border: "none",
			cursor: "pointer",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			float: "left",
			padding: 0,
			":hover": {
				backgroundColor: "rgba(0, 0, 0, .1)",
			},
			width: "2rem",
			height: "2rem",
		}}
		type="button"
		onClick={onClick}
	>
		<svg
			style={{
				fill: "black",
				height: "12px",
				width: "12px",
			}}
			viewBox="0 0 20 20"
		>
			<path
				d="M19.78 18.36L12.12 10.7L19.78 3.04L18.36 1.62L10.7 9.28L3.04 1.62L1.62 3.04L9.28 10.7L1.62 18.36L3.04 19.78L10.7 12.12L18.36 19.78L19.78 18.36Z"
			/>
		</svg>
	</button>
}

interface FilterSectionProps {
	title: string;
	children: React.ReactNode;
}
function FilterArticle({ title, children }: FilterSectionProps) {

	return <article
		css={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			borderBottom: theme.border.create(),
			padding: "1rem",
		}}
	>
		<h3 css={{
			fontWeight: "bold",
			justifySelf: "left"
		}}>
			{title}
		</h3>
		{children}
	</article>
}

function RadioGroup({ title, count }) {
	const [checked, setChecked] = useState(0)

	const focus_properties = {
		border: theme.border.create({
			color: theme.colors.selected
		}),
	}

	const border_radius = "2em"

	return <div
		css={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		}}
	>
		{Array.from({ length: count + 1 }, (_, i) => i).map((n) => {
			const ID = `${title}_${n}`

			return <label
				htmlFor={ID}
				key={n}
				id={title}
				css={{
					alignItems: "center",
					backgroundColor: theme.colors.background,
					border: theme.border.create(),
					borderRadius: border_radius,
					display: "flex",
					flexDirection: "column",
					minWidth: "2rem",
					padding: ".5rem",
					position: "relative",
					transitionProperty: "border, background-color",
					transitionDuration: theme.transition.transitionDuration,
					transitionTimingFunction: theme.transition.transitionTimingFunction,
					":hover": focus_properties,
					":focus-within": focus_properties,
					...checked === n && {
						backgroundColor: theme.colors.selected,
						color: theme.colors.onSelected,
					}
				}}
			>
				{n === 0 ? "Any" : n === count ? `${n}+` : n}
				<input
					defaultChecked={checked === n}
					id={ID}
					name={title}
					type="radio"
					value={n}
					required
					css={{
						boxSizing: "border-box",
						position: "absolute",
						appearance: "none",
						top: -theme.border.borderWidth * 2,
						borderRadius: border_radius,
						width: "100%",
						height: `calc(100% - ${theme.border.borderWidth * 2}px)`,
					}}
					onInput={(inputEvent) =>
						(inputEvent.target as HTMLInputElement).checked &&
						setChecked(n)
					}
				/>
			</label>
		})}
	</div>
}

function RadioArticle({ title, count }) {
	return <div
		css={{
			display: "flex",
			flexDirection: "column",
			alignItems: "left",
			marginBottom: "1rem",
		}}
	>
		<label htmlFor={title}>{title}</label>

		<RadioGroup title={title} count={count} />
	</div>
}

interface AmenitiesProps {
	items: Amenity[];
	name: string;
}
function Amenities({ items, name }: AmenitiesProps) {
	return <article
		css={{
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			justifyContent: "space-between",
		}}
	>
		{items.map((item: Amenity) =>
			<div key={item.id}>
				<input
					id={item.name}
					name={name}
					type="checkbox"
					value={item.id}
					css={{
						appearance: "menulist-button",
						border: theme.border.create(),
						borderRadius: theme.border.radiusSecondary,
						fontSize: ".1rem",
						marginRight: ".5rem",
						accentColor: theme.colors.selected,
						transitionProperty: "border-color, background-color",
						transitionDuration: theme.transition.transitionDuration,
						transitionTimingFunction: theme.transition.transitionTimingFunction,
						width: "1rem",
						height: "1rem",
						":hover": {
							borderColor: theme.colors.selected,
						},
						":focus-within": {
							borderColor: theme.colors.selected,
						},
						":checked": {
							backgroundColor: theme.colors.selected,
							borderColor: theme.colors.selected,
						},

					}}

				/>
				<label htmlFor={item.id}>{item.name}</label>
			</div>
		)}
	</article>
}

interface FormSubmitButtonProps {
	title: string;
	onClick: () => void;
}
function FormSubmitButton({ title, onClick }: FormSubmitButtonProps) {
	const focus_properties = {
		backgroundColor: theme.colors.selected,
		color: theme.colors.onSelected,
	}

	return <button
		css={{
			backgroundColor: theme.colors.background,
			border: theme.border.create(),
			borderRadius: theme.border.radiusSecondary,
			color: theme.colors.secondary,
			cursor: "pointer",
			fontWeight: "bold",
			padding: ".5rem 1rem",
			transitionProperty: "background-color, color",
			transitionDuration: theme.transition.transitionDuration,
			transitionTimingFunction: theme.transition.transitionTimingFunction,
			":hover": focus_properties,
			":focus-within": focus_properties,
		}}
		type="button"
		onClick={onClick}
	>
		{title}
	</button>
}
