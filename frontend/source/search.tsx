import { keyframes } from '@emotion/react';
import { theme } from './theme';


namespace styles {
  export const searchBarButtonDiv = {
    "padding": "0 10px",
  }

  export const searchBarButton = {
    "display": "flex",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "fontSize": "medium",
    "border": "none",
    "backgroundColor": "transparent",
    "padding": "10px",
  }
}

namespace animations {
  export const shadow_fade = keyframes({
    to: {
      boxShadow: "0 3px 5px 0px var(--whisper-grey)",
    }
  })
}

export function Search() {
  return (
    <div style={{
      "alignItems": "center",
      "display": "flex",
      "justifyContent": "center",
      "width": "100%",
      "maxWidth": "100%"
    }}>
      <article className='search_buttons' css={{
        "display": "flex",
        "alignItems": "center",
        "border": theme.border.create(),
        "borderRadius": theme.border.radiusPrimary,
        "boxShadow": "0 3px 5px -2px var(--whisper-grey)",
        "height": "100%",
        "cursor": "pointer",
        "pointerEvents": "auto",
        ":hover": {
          "animation": `${animations.shadow_fade} 0.2s ease forwards;`,
        }
      }
      } >
        <button
          className='anywhere'
          css={
            {
              ...styles.searchBarButton,
              "borderRadius": "100px 0 0 100px"
            }

          }>
          <div style={styles.searchBarButtonDiv}>
            Anywhere
          </div>
        </button>
        <button
          css={{
            ...styles.searchBarButton,
            "borderWidth": "0 1px",
            "borderStyle": "solid",
            "borderColor": "var(--whisper-grey)",
          }}
        >
          <div style={styles.searchBarButtonDiv}>
            Any week
          </div>
        </button>
        <button
          className='add_guests'
          css={{
            ...styles.searchBarButton,
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "color": "var(--unfocused-grey)",
            "borderRadius": "0 100px 100px 0",
          }}
        >
          <div style={styles.searchBarButtonDiv}>
            Add guests
          </div>
          <SearchIconButton />
        </button>
      </article>
    </div >
  )
}

function SearchIconButton() {
  const magnifyingGlassWidth = "2px";
  return (
    <span style={{
      "backgroundColor": "var(--primary-color)",
      "borderRadius": "50%",
      "display": "grid",
      "gridTemplateColumns": "10px 10px 10px",
      "gridTemplateRows": "10px 10px 10px",
      "height": "30px",
      "width": "30px",
    }}>
      <span
        style={{
          "position": "relative",
          "gridArea": "2 / 2 / 2 / 2",
        }}
      >
        <span style={{
          "border": `${magnifyingGlassWidth} solid white`,
          "borderRadius": "50%",
          "boxSizing": "border-box",
          "display": "block",
          "height": "80%",
          "width": "80%",
        }} />
        <span style={{
          "borderRight": `${magnifyingGlassWidth} solid white`,
          "bottom": "0",
          "boxSizing": "border-box",
          "display": "block",
          "height": "50%",
          "position": "absolute",
          "right": "0",
          "transform": "rotate(-42deg)",
          "transformOrigin": "bottom right",
        }} />
      </span>
    </span>
  )
}
