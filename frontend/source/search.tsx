import React, { useEffect, useState } from 'react'
import { theme, icons } from './theme'
import { api_routes } from './routes'


namespace styles {
  export const searchBarButtonDiv = {
    "padding": "0 10px",
  }

  export const searchBarButton = {
    "alignItems": "center",
    "border": "none",
    "borderRadius": theme.border.radiusPrimary,
    "boxSizing": "border-box",
    "display": "flex",
    "flex": 1,
    "flexDirection": "row",
    "fontSize": "medium",
    "height": "100%",
    "justifyContent": "center",
    "padding": "10px",
    "position": "relative",
    "backgroundColor": theme.colors.background,
    zIndex: 1,
  }

  export const searchBarButtonActive = {
    "backgroundColor": theme.colors.behind,
    ":hover": {
      backgroundColor: theme.colors.focused,
    }
  }

  export const searchBarButtonSelected = {
    "backgroundColor": theme.colors.background,
    "boxShadow": theme.boxShadow.create(),
    "zIndex": 2,
    ":hover": {
      backgroundColor: theme.colors.background,
    }
  }

}

type SearchButton = 'anywhere' | 'any week' | 'add guests' | undefined

interface SearchBarProps {
  setFilters: (filters: any) => void
}
export function SearchBar({ setFilters }: SearchBarProps) {
  const [active, setActive] = useState(false)

  const [selectedStates, setSelectedStates] =
    useState<Set<string>>(new Set())

  const [guestCount, setGuestCount] = useState(1)

  const [selectedButton, setSelectedButton] = useState<SearchButton>()

  const max_guests = 20

  return (
    <div
      css={{
        "alignItems": "center",
        "display": "flex",
        "justifyContent": "center",
        "maxWidth": "100%",
      }}
    >
      <article className='search_buttons'
        css={{
          display: "flex",
          alignItems: "center",
          backgroundColor: active ? theme.colors.behind : theme.colors.background,
          border: theme.border.create({
            color: theme.colors.focused,
          }),
          borderRadius: theme.border.radiusPrimary,
          boxShadow: `0 3px 5px -2px ${theme.colors.border}`,
          cursor: active ? "auto" : "pointer",
          height: "3rem",
          minWidth: active ? "60vw" : "0vw",
          pointerEvents: "auto",
          transition: theme.transition.create({ property: "box-shadow" }) +
            ", " + theme.transition.create({ property: "min-width" }),
          ":hover": {
            boxShadow: `0 3px 5px 0px ${theme.colors.border}`,
          }
        }}

        onClick={() => setActive(true)}
      >
        <SearchBarButton
          active={active}
          selected={selectedButton === 'anywhere'}
          onClick={() => setSelectedButton('anywhere')}
          dropdown={<AnywhereMenu setSelectedStates={setSelectedStates} />}
        >
          Anywhere
        </SearchBarButton>
        <VerticalDivider />
        <SearchBarButton
          onClick={() => setSelectedButton('any week')}
          active={active}
          selected={selectedButton === 'any week'}
          dropdown={<AnyTimeMenu />}
        >
          Any Week
        </SearchBarButton>
        <VerticalDivider />
        <SearchBarButton
          css={{ color: theme.colors.tertiary }}
          active={active}
          selected={selectedButton === 'add guests'}
          onClick={(clickEvent) => {
            setSelectedButton('add guests')
            clickEvent.currentTarget.querySelector('input')?.focus()
          }}
        >
          <input
            type='text'
            placeholder='Add guests'
            min={1}
            max={max_guests}
            css={{
              border: "none",
              backgroundColor: "transparent",
              fontSize: "medium",
              textAlign: "center",
              outline: "none",
              padding: "0",
              width: "7rem"
            }}
            onInput={(inputEvent) => {
              const target = inputEvent.currentTarget as HTMLInputElement

              if (
                target.value.length > 0 &&
                isNaN(parseInt(target.value.at(-1)))
              ) {
                target.value = target.value.slice(0, -1)
              } else if (
                parseInt(target.value) > max_guests
              ) {
                target.value = max_guests.toString()
              }
              target.value = target.value.replace(/^0+/, '')

              setGuestCount(parseInt(target.value))
            }}
          />
          <SearchIconButton
            active={active}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              setActive(false)
              setSelectedButton(undefined)
              setFilters((filters) => ({
                ...filters,
                guest_count: guestCount,
                state_IDs: selectedStates.size > 0 ? Array.from(selectedStates) : undefined,
              }))
            }}
          />
        </SearchBarButton>
      </article>
    </div >
  )
}

interface SearchIconButtonProps {
  active: boolean
  onClick: React.EventHandler<
    React.MouseEvent<HTMLSpanElement> |
    React.KeyboardEvent<HTMLSpanElement>
  >
}
function SearchIconButton({ active, onClick }: SearchIconButtonProps) {
  const size = "1rem"

  return (
    <span
      tabIndex={0}
      css={{
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "backgroundColor": theme.colors.primary,
        "borderRadius": theme.border.radiusPrimary,
        padding: "0.5rem",
        color: theme.colors.onPrimary,
        width: active ? "5rem" : size,
        height: size,
        ":hover": {
          backgroundColor: theme.colors.primaryHover,
        }
      }}

      onKeyUp={(keyEvent) => {
        if (keyEvent.key === "Enter") {
          onClick(keyEvent)
        }
      }}
      onClick={onClick}
    >
      <icons.magnifyingGlass fill={theme.colors.onPrimary} />
      <span css={{
        paddingLeft: "0.5rem",
        display: active ? "block" : "none",
      }}>
        Search
      </span>
    </span>
  )
}

function VerticalDivider() {
  return (
    <div css={{
      "borderLeft": theme.border.create({
        color: theme.colors.focused,
      }),
      "height": "65%",
      "width": 0,
    }} />
  )
}

function Dropdown({ visible, children }: { visible: boolean, children?: React.ReactNode }) {
  return (
    <article css={{
      "backgroundColor": theme.colors.background,
      "border": theme.border.create(),
      "borderRadius": theme.border.radiusPrimary,
      "boxShadow": theme.boxShadow.create(),
      "boxSizing": "border-box",
      "display": visible ? "flex" : "none",
      "justifyContent": "center",
      "left": 0,
      "maxHeight": "50vh",
      "marginTop": "0.5rem",
      "overflowY": "auto",
      "position": "absolute",
      "top": "100%",
      "width": "100%",
    }} >
      {children}
    </article>
  )
}

interface SearchBarButtonProps {
  active?: boolean
  selected?: boolean
  onClick?: React.EventHandler<
    React.MouseEvent<HTMLButtonElement> |
    React.KeyboardEvent<HTMLButtonElement>
  >
  children?: React.ReactNode
  css?: React.CSSProperties
  dropdown?: React.ReactNode
}
export function SearchBarButton(
  { active, selected, onClick, children, css, dropdown }: SearchBarButtonProps
) {
  return (
    <button
      css={{
        ...styles.searchBarButton,
        ...active && styles.searchBarButtonActive,
        ...selected && styles.searchBarButtonSelected,
        ...css
      }}
      onClick={onClick}
    >
      <div css={{
        "display": "flex",
        "alignItems": "center",
        "flexDirection": "row",
        "whiteSpace": "nowrap",
        "padding": "0 10px",
      }}>
        {children}
      </div>
      <Dropdown visible={selected && dropdown}>{dropdown}</Dropdown>
    </button>
  )
}

interface AnywhereMenuProps {
  setSelectedStates: (selectedStates: any) => void
}
function AnywhereMenu({ setSelectedStates: _setSelectedStates }: AnywhereMenuProps) {
  interface State {
    name: string
    id: string
  }

  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())

  const [states, setStates] = useState<State[]>([])

  useEffect(() => {
    if (states.length > 0) {
      return
    }
    fetch(api_routes.states)
      .then(response => response.json())
      .then((states_json) => {
        setStates(states_json
          .sort((a, b) => a.name > b.name ? 1 : -1)
          .map((state: any) => ({
            name: state.name,
            id: state.id,
            checked: false,
          }))
        )
      })
  }, [])

  useEffect(() => {
    _setSelectedStates(selectedStates)
  }, [selectedStates])

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
        overflowY: "auto",
        padding: "1rem",
        width: "100%",
      }}
    >
      {states.map(({ name, id }) => (
        <div
          key={id}
          css={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type='checkbox'
            css={{
              margin: "0 0.5rem",
              cursor: "pointer",
            }}
            defaultChecked={selectedStates[id]}
            onInput={(inputEvent) => {
              const target = inputEvent.currentTarget as HTMLInputElement
              setSelectedStates((selectedStates) => {
                if (target.checked) {
                  selectedStates.add(id)
                } else {
                  selectedStates.delete(id)
                }
                return new Set(selectedStates)
              }
              )
            }}
          />
          {name}
        </div>
      ))}
    </div>
  )
}

function AnyTimeMenu() {
  const css = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  }

  return (
    <div css={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
      overflowY: "auto",
      padding: "1rem",
      width: "100%",
    }}>
      <div css={css}>
        <label htmlFor='from_date'>From</label>
        <input id='from_date' type='date' />
      </div>
      <div css={css}>
        <label htmlFor='to_date'>To</label>
        <input id='to_date' type='date' />
      </div>
    </div>
  )
}
