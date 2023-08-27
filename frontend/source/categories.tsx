import { forwardRef, useEffect, useImperativeHandle } from "react"
import React from "react"
import { useWindowSize } from "./library.js"
import { theme, icons, colors } from "./theme.js"
import { Filters } from "./index.js"
import { api_routes } from "./routes.js"


namespace api {
  export const categories = fetch(api_routes.categories)
}


interface FilterBarProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  setFilters: (update: (filters: Filters) => Filters) => void
}
export function FilterBar({ setShowDialog, setFilters }: FilterBarProps) {

  const [scrollPreviousVisible, setScrollPreviousVisible] = React.useState(false)

  const [scrollNextVisible, setScrollNextVisible] = React.useState(false)

  const [boxShadowVisible, setBoxShadowVisible] = React.useState(false)

  const categoriesRef = React.useRef<CategoriesHandle>(null)

  const scrollAmount = 500

  const scrollListener = () =>
    document.getElementsByTagName("html")[0].scrollTop > 0 ?
      setBoxShadowVisible(true) :
      setBoxShadowVisible(false)

  window.removeEventListener("scroll", scrollListener)

  window.addEventListener("scroll", scrollListener)

  return (
    <article
      css={{
        alignItems: "center",
        display: "grid",
        gridTemplateColumns: "auto 20px 90px",
        gridTemplateRows: "auto",
        position: "relative",
        height: "100%",
        maxWidth: "100%",
        width: "100%",
        boxShadow: boxShadowVisible && theme.boxShadow.create({ vertical: 4, blur: 4, opacity: 0.1 }),
      }}
    >
      <div
        css={{
          position: "relative",
          overflowX: "auto",
          maxHeight: "100%",

        }}
      >
        <ScrollCategories
          direction="left"
          enabled={scrollPreviousVisible}
          onClick={() => categoriesRef.current?.scroll(-scrollAmount)}
        />
        <Categories
          ref={categoriesRef}
          setScrollPreviousVisible={setScrollPreviousVisible}
          setScrollNextVisible={setScrollNextVisible}
          setCategoryID={(category_id) =>
            setFilters((filters) => ({ ...filters, category_ID: category_id }))
          }
        />
        <ScrollCategories
          direction="right"
          enabled={scrollNextVisible}
          onClick={() => categoriesRef.current?.scroll(scrollAmount)}
        />
      </div>
      <FiltersButton
        onClick={() => setShowDialog(true)}
      />
    </article >
  )
}

type CategoriesHandle = {
  scroll: (arg0: number) => void;
}
interface CategoriesProps {
  setScrollPreviousVisible: React.Dispatch<React.SetStateAction<boolean>>
  setScrollNextVisible: React.Dispatch<React.SetStateAction<boolean>>
  setCategoryID: (category_id: string) => void
}
const Categories = forwardRef<CategoriesHandle, CategoriesProps>(
  ({ setScrollPreviousVisible, setScrollNextVisible, setCategoryID }, ref) => {
    const [categories, setCategories] =
      React.useState<{ id: string, name: string }[]>([])

    const [selectedIndex, setSelectedIndex] =
      React.useState<number | undefined>()

    const formRef = React.useRef<HTMLFormElement>(null)

    const minmax = (n: number, min: number, max: number) =>
      Math.min(Math.max(n, min), max)

    function getScrollMax() {
      const form = formRef.current
      if (!form) return 0
      return form.scrollLeftMax ?? form.scrollWidth - form.clientWidth
    }

    function scroll(scrollAmount: number) {
      const scrollPosition = formRef.current?.scrollLeft ?? 0

      const nextScrollPosition = minmax(
        scrollPosition + scrollAmount,
        0,
        getScrollMax()
      )

      formRef.current?.scrollTo({
        left: nextScrollPosition,
        behavior: 'smooth'
      })

      updateScrollButtonVisibility(nextScrollPosition)
    }

    // Assigns scroll as a function callable from outside the component
    useImperativeHandle(ref, () => ({ scroll }));

    function updateScrollButtonVisibility(scrollPosition?: number) {
      scrollPosition = scrollPosition ?? formRef.current?.scrollLeft ?? 0

      const scrollButtonVisibilityThreshold = 20

      setScrollPreviousVisible(scrollPosition > scrollButtonVisibilityThreshold)

      setScrollNextVisible(
        scrollPosition < getScrollMax() - scrollButtonVisibilityThreshold
      )
    }

    useEffect(updateScrollButtonVisibility)

    useEffect(updateScrollButtonVisibility, [useWindowSize()])

    function scale(element: HTMLElement, factor: number) {
      element.animate([
        // { transform: `scale(1)` },
        { transform: `scale(${factor})` },
      ],
        {
          duration: 300,
          iterations: 1,
          easing: 'ease-out',
          fill: 'forwards',
        }
      );
    }

    const animationContainerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
      async function fetchCategories() {
        try {
          const data = await (await api.categories).json()

          if (!(data instanceof Array)) {
            console.error("Categories data is not an array")
            return
          }

          const categories = []

          for (const object of data) {
            if (typeof object.name !== "string") {
              console.error("Category name is not a string, it is a",
                typeof object.name)
              continue
            } else if (typeof object.id !== "string") {
              console.error("Category ID is not a string, it is a",
                typeof object.name)
              continue
            }
            categories.push({ id: object.id, name: object.name })
          }

          setCategories(categories)

        } catch (error) {
          console.error("Failed to fetch categories:", error)
        }
      }

      fetchCategories()
    }, [api.categories])

    const border_bottom_width = 2

    return (
      <article
        ref={formRef}
        css={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          gap: "30px",
          height: "100%",
          justifyContent: "space-between",
          margin: "0px",
          overflowX: "auto",
          padding: "0px",
          scrollbarWidth: "none",
          whiteSpace: "nowrap",
          width: "100%",
          "::-webkit-scrollbar": {
            display: "none"
          }
        }}
        className="categories"
        onScroll={(scrollEvent) =>
          updateScrollButtonVisibility(
            (scrollEvent.target as HTMLFormElement).scrollLeft
          )
        }
      >
        {
          categories.map(({ id: category_id, name: category_name }, index) => {
            const fade_duration = .15

            return <li
              css={{
                alignItems: "center",
                borderBottom: theme.border.create({
                  width: border_bottom_width,
                  color: colors.transparent,
                }),
                boxSizing: "border-box",
                color: theme.colors.tertiary,
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                fontSize: "12px",
                height: "100%",
                justifyContent: "space-around",
                paddingBottom: "12px",
                transition: `color ${fade_duration}s ease-in-out, border-bottom ${fade_duration}s ease-in-out`,
                ":hover": (index !== selectedIndex) && {
                  color: theme.colors.selected,
                  borderBottom: theme.border.create({
                    width: border_bottom_width,
                    color: theme.colors.tertiary,
                  }),
                },
                ...(index === selectedIndex && {
                  color: theme.colors.selected,
                  borderBottom: theme.border.create({
                    width: border_bottom_width,
                    color: theme.colors.selected,
                  })
                })
              }}
              title={category_name}
              key={category_id}
              onClick={() => {
                setSelectedIndex(index)
                setCategoryID(category_id)
              }}
            >
              <div
                ref={animationContainerRef}
                css={{
                  display: 'inherit',
                  flexDirection: 'inherit',
                  alignItems: 'inherit',
                  justifyContent: 'inherit',
                }}
                onMouseDown={mouseEvent => scale(mouseEvent.currentTarget!, 0.95)}
                onMouseUp={mouseEvent => scale(mouseEvent.currentTarget!, 1)}
              >
                <span
                  css={{
                    display: "flex",
                    height: "40px",
                    margin: "2px",
                    textAlign: "center",
                    alignItems: "center",
                    width: "40px"
                  }}
                >
                  <icons.house
                    fill={selectedIndex === index ?
                      theme.colors.selected : theme.colors.tertiary
                    }
                  />
                </span>
                <span>{category_name}</span>
              </div>
            </li>
          })
        }
      </article>
    )
  })


interface ScrollCategoriesButtonProps {
  disabled: boolean
  arrowDirection: "left" | "right"
  onClick: () => void
}
function ScrollCategoriesButton({ disabled, onClick, arrowDirection }: ScrollCategoriesButtonProps) {

  const size = "2em"

  return <button
    className="scroll_button"
    disabled={disabled}
    css={{
      alignItems: "center",
      border: theme.border.create({
        width: 1,
        color: theme.colors.focused,
      }),
      backgroundColor: "white",
      borderRadius: "100%",
      cursor: disabled ? "default" : "pointer",
      display: "flex",
      height: size,
      justifyContent: "center",
      padding: ".5em",
      pointerEvents: disabled ? "none" : "auto",
      textAlign: "end",
      transition: "scale .1s ease-in-out",
      width: size,
      ":hover": {
        scale: "1.05",
        boxShadow: theme.boxShadow.create({
          vertical: 6,
          blur: 12,
          opacity: 0.25
        }),
      },

    }}
    type="button"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      css={{
        fill: "none",
        height: "12px",
        width: "12px",
        stroke: theme.colors.secondary,
        strokeWidth: "5.33333",
        overflow: "visible",
        rotate: arrowDirection === "right" ? "180deg" : "0deg",
      }}
    >
      <path
        fill="none"
        d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"
      ></path></svg>
  </button >
}

interface ScrollCategoriesProps {
  direction: "left" | "right"
  enabled: boolean
  onClick: () => void
}
function ScrollCategories({ direction, enabled, onClick }: ScrollCategoriesProps) {

  const divRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const button = divRef.current

    console.log(`Fading ${enabled ? 'in' : 'out'} ${direction} button}`)

    if (!button) return

    button.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      {
        duration: 300,
        iterations: 1,
        easing: 'ease-out',
        direction: enabled ? 'normal' : 'reverse',
        fill: 'forwards',
      }
    )


  }, [enabled])


  return (
    <div
      ref={divRef}
      css={{
        alignItems: direction === "left" ? "flex-start" : "flex-end",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        pointerEvents: "none",
        position: "absolute",
        top: "0",
        width: "10%",
        backgroundImage: `linear-gradient(to ${direction}, rgb(255 255 255/0), white 50%)`,
        [direction]: "0",
        overflow: "hidden",
      }}
    >
      <ScrollCategoriesButton
        disabled={!enabled}
        onClick={onClick}
        arrowDirection={direction}
      />
    </div>
  )
}


function FiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      css={{
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: theme.border.radiusSecondary,
        border: theme.border.create(),
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        gridColumn: "3",
        height: "60%",
        justifyContent: "center",
        padding: "10px",
        cursor: "pointer",
      }}
      type="button"
      onClick={onClick}
    >
      <icons.filters />
      <div>Filters</div>
    </button>
  )
}
