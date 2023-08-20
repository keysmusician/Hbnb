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

interface SearchProps {
  setFilters: (filters: any) => void;
}
export function Search({ setFilters }: SearchProps) {
  return (
    <div
      css={{
        "alignItems": "center",
        "display": "flex",
        "justifyContent": "center",
        "width": "100%",
        "maxWidth": "100%"
      }}

      onClick={(mouseEvent) => {
        const target = mouseEvent.currentTarget as HTMLElement;
        console.log(target.parentElement)
      }}
    >
      <article className='search_buttons'
        css={{
          display: "flex",
          alignItems: "center",
          border: theme.border.create(),
          borderRadius: theme.border.radiusPrimary,
          boxShadow: `0 3px 5px -2px ${theme.colors.border}`,
          height: "100%",
          cursor: "pointer",
          pointerEvents: "auto",
          transition: theme.transition.create({ property: "box-shadow" }),
          ":hover": {
            boxShadow: `0 3px 5px 0px ${theme.colors.border}`,
          }
        }} >
        <button
          className='anywhere'
          css={{
            ...styles.searchBarButton,
            "borderRadius":
              `${theme.border.radiusPrimary} 0 0 ${theme.border.radiusPrimary}`,
          }}
        >
          <div css={styles.searchBarButtonDiv}>
            Anywhere
          </div>
        </button>
        <button
          css={{
            ...styles.searchBarButton,
            borderLeft: theme.border.create(),
            borderRight: theme.border.create(),
          }}
        >
          <div css={styles.searchBarButtonDiv}>
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
            "color": theme.colors.tertiary,
            "borderRadius":
              `0 ${theme.border.radiusPrimary} ${theme.border.radiusPrimary} 0`,
          }}
        >
          <div css={styles.searchBarButtonDiv}>
            Add guests
          </div>
          <SearchIconButton onClick={() => setFilters((filters) => filters)} />
        </button>
      </article>
    </div >
  )
}

interface SearchIconButtonProps {
  onClick: () => void;
}
function SearchIconButton({ onClick }: SearchIconButtonProps) {
  const magnifyingGlassWidth = "2px";

  return (
    <span
      css={{
        "backgroundColor": theme.colors.primary,
        "borderRadius": theme.border.radiusPrimary,
        "display": "grid",
        "gridTemplateColumns": "10px 10px 10px",
        "gridTemplateRows": "10px 10px 10px",
        "height": "30px",
        "width": "30px",
      }}
      onClick={onClick}
    >
      <span
        css={{
          "position": "relative",
          "gridArea": "2 / 2 / 2 / 2",
        }}
      >
        <span
          css={{
            "border": `${magnifyingGlassWidth} solid white`,
            "borderRadius": "50%",
            "boxSizing": "border-box",
            "display": "block",
            "height": "80%",
            "width": "80%",
          }}
        />
        <span
          css={{
            "borderRight": `${magnifyingGlassWidth} solid white`,
            "bottom": "0",
            "boxSizing": "border-box",
            "display": "block",
            "height": "50%",
            "position": "absolute",
            "right": "0",
            "transform": "rotate(-42deg)",
            "transformOrigin": "bottom right",
          }}
        />
      </span>
    </span>
  )
}
