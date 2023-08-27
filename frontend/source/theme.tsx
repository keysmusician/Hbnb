export namespace colors {
	export const white = "white"
	export const black = "black"
	export const lightGrey = "rgb(235, 235, 235)"
	export const transparent = "transparent"
	export const AirBnbRed = "rgb(255, 56, 92)"
	export const AirBnbRed2 = "#E00B41"
	export const AirBnbGrey = 'rgb(113, 113, 113)'
	export const AirBnbGrey2 = 'rgb(221, 221, 221)'
	export const AirBnbGrey3 = lightGrey
}

export namespace typography {
	export const fontFamily = "Roboto, sans-serif"
	export const fontSize = 16
	export const fontWeight = 400
	export const letterSpacing = 0
	export const lineHeight = 1.5
	export const textTransform = "none"
}

const _colors = colors

export namespace theme {
	export namespace colors {
		export const primary = _colors.AirBnbRed
		export const onPrimary = _colors.white
		export const primaryHover = _colors.AirBnbRed2
		export const secondary = _colors.black
		export const onSecondary = _colors.white
		export const tertiary = _colors.AirBnbGrey
		export const onTertiary = _colors.white
		export const background = _colors.white
		export const border = _colors.lightGrey
		export const behind = border
		export const focused = _colors.AirBnbGrey2
		export const selected = secondary
		export const onSelected = onSecondary
	}
	export namespace typography {
		export const fontFamily = "Roboto, sans-serif"
		export const fontSize = 16
		export const fontWeight = 400
		export const letterSpacing = 0
		export const lineHeight = 1.5
		export const textTransform = "none"
	}
	export namespace opacity {
		export const hoverOpacity = 0.08
		export const focusOpacity = 0.24
		export const activeOpacity = 0.32
		export const disabledOpacity = 0.32
	}
	export namespace border {
		export const radiusPrimary = "2em" // Reference a base token
		export const radiusSecondary = "1em" // ditto
		export const borderWidth = 1
		export const borderStyle = "solid"
		export const borderColor = colors.border
		export const create = ({
			width = borderWidth,
			style = borderStyle,
			color = borderColor,
		} = {}) =>
			`${width}px ${style} ${color}`
	}
	export namespace boxShadow {
		export const boxShadowOpacity = 0.5
		export const boxShadowBlur = 5
		export const boxShadowSpread = -2
		export const boxShadowHorizontal = 0
		export const boxShadowVertical = 3
		export const create = ({
			opacity = boxShadowOpacity,
			blur = boxShadowBlur,
			spread = boxShadowSpread,
			horizontal = boxShadowHorizontal,
			vertical = boxShadowVertical,
		} = {}) =>
			`${horizontal}px ${vertical}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`
	}
	export namespace transition {
		export const transitionDuration = 0.15
		export const transitionTimingFunction = "ease-in-out"
		export const transitionDelay = 0
		export const transitionProperty = "all"
		export const create = ({
			duration = transitionDuration,
			timingFunction = transitionTimingFunction,
			delay = transitionDelay,
			property = transitionProperty,
		} = {}) =>
			`${property} ${duration}s ${timingFunction} ${delay}s`
	}
	export namespace animation {
		export const fadeDuration = 200
	}

	// Suggested by CoPilot:
	// export namespace elevation {
	// 	export const elevation = 2
	// 	export const onElevation = 2
	// 	export const hoverElevation = 4
	// 	export const focusElevation = 8
	// 	export const activeElevation = 8
	// 	export const disabledElevation = 0
	// }
	// export const onBackground = colors.black
	// export const onSurface = colors.black
	// export const onError = colors.white
	// export const surface = colors.white
	// export const error = colors.AirBnb_red
	// export const text = colors.black
	// export const onText = colors.white
	// export const disabled = colors.AirBnb_grey
	// export const onDisabled = colors.white
	// export const placeholder = colors.AirBnb_grey
	// export const onPlaceholder = colors.white
	// export const icon = colors.black
	// export const onIcon = colors.white
	// export const divider = colors.AirBnb_grey
	// export const onDivider = colors.white
	// export const elevation = 2
	// export const onElevation = 2
	// export const hoverElevation = 4
	// export const focusElevation = 8
	// export const activeElevation = 8
	// export const disabledElevation = 0
	// export const hoverOpacity = 0.08
	// export const focusOpacity = 0.24
	// export const activeOpacity = 0.32
	// export const disabledOpacity = 0.32
	// export const borderRadius = 4
	// export const borderWidth = 1
	// export const borderStyle = "solid"
	// export const borderColor = colors.AirBnb_grey_2
	// export const borderOpacity = 1
	// export const fontFamily = "Roboto, sans-serif"
	// export const fontSize = 16
	// export const fontWeight = 400
	// export const letterSpacing = 0
	// export const lineHeight = 1.5
	// export const textTransform = "none"
	// export const transitionDuration = 0.2
	// export const transitionTimingFunction = "ease-in-out"
	// export const transitionDelay = 0
	// export const transitionProperty = "all"
}

export namespace icons {

	export const house = ({ fill = theme.colors.secondary }) => <svg
		fill={fill}
		version="1.1"
		id="Capa_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 200 200"
		xmlSpace="preserve"
		css={{
			"height": "100%",
			"width": "100%",
		}}
	>
		<g>
			<path d="M111.129,58.105c-1.787-1.787-4.682-1.787-6.469,0l-47.404,47.401c-1.786,1.786-1.786,4.682,0,6.468   c0.894,0.893,2.063,1.34,3.234,1.34c1.17,0,2.341-0.447,3.234-1.339l6.074-6.074v36.362c0,2.526,2.047,4.574,4.573,4.574h67.038   c2.526,0,4.573-2.048,4.573-4.574v-36.368l6.079,6.079c1.787,1.786,4.682,1.786,6.469,0c1.786-1.786,1.786-4.682,0-6.468   L111.129,58.105z M136.837,137.689H78.945V96.754l28.949-28.948l28.942,28.942V137.689z" />
		</g>
	</svg>

	export const filters = ({ fill = theme.colors.secondary }) =>
		<svg
			fill={fill}
			css={{
				"display": "block",
				"height": "14px",
				"width": "14px",
			}} viewBox="0 0 16 16">
			<path d="M5 8a3 3 0 0 1 2.83 2H14v2H7.83A3 3 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.83 4H2V4h6.17A3 3 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
		</svg>

	export const magnifyingGlass = ({ fill = theme.colors.secondary }) =>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			css={{
				display: "block",
				fill: fill,
				height: "12px",
				width: "12px",
				stroke: fill,
				strokeWidth: " 5.33333px",
				overflow: "visible",
			}}
			aria-hidden="true"
			role="presentation"
			focusable="false"
		>
			<path
				fill="none"
				d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"
			/>
		</svg>

	// export const arrowDown = ({ fill = theme.colors.secondary }) =>
	// 	<svg
	// 		fill={fill}
	// 		css={{
	// 			"display": "block",
	// 			"height": "14px",
	// 			"width": "14px",
	// 		}} viewBox="0 0 24 24">
	// 		<path d="M7 10l5 5 5-5z"></path>
	// 	</svg>
}
