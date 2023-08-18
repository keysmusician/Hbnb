import { forwardRef, useEffect, useImperativeHandle } from "react"
import React from "react"
import { API_root } from "../static/scripts/api_root.js"
import { renderSearch } from "../static/scripts/hbnb.js"
import { keyframes } from "@emotion/react"


namespace api {
  export const categories = fetch(API_root + "/categories")
}

namespace animations {

  const border_style = "solid 2px"

  const fade_in_end_properties = {
    "color": "var(--focused-text-color)",
    "borderBottom": `${border_style} var(--unfocused-text-color)`,
  }

  export const fade_color_in = keyframes(
    { "to": fade_in_end_properties, }
  )

  export const fade_color_out = keyframes(
    {
      "from": fade_in_end_properties,
      "to":
      {
        "color": "var(--unfocused-text-color)",
        "borderBottom": `${border_style} transparent`,
      }
    }
  )
}

export function FilterBar() {

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
    <article style={{
      "alignItems": "center",
      "display": "grid",
      "gridTemplateColumns": "auto 20px 90px",
      "gridTemplateRows": "auto",
      "position": "relative",
      "height": "100%",
      "width": "100%",
      "maxWidth": "100%",
      "boxShadow": boxShadowVisible && "rgba(134, 142, 149, 0.2) 0px 4px 4px -2px",
    }}>
      <div style={{
        "position": "relative",
        "overflowX": "auto",
      }}
      >
        <div className={`
                        scroll_button_container
                        scroll_previous
                        ${scrollPreviousVisible ?
            "scroll_button_container_visible" :
            ""
          }
                    `}
        >
          <ScrollCategoriesButton
            disabled={!scrollPreviousVisible}
            onClick={() => categoriesRef.current?.scroll(-scrollAmount)}
            arrowDirection="left"
          />
        </div>
        <Categories
          ref={categoriesRef}
          setScrollPreviousVisible={setScrollPreviousVisible}
          setScrollNextVisible={setScrollNextVisible}
        />
        <div
          className={`
            scroll_button_container
            scroll_next
            ${scrollNextVisible ? "scroll_button_container_visible" : ""}
          `}
        >
          <ScrollCategoriesButton
            disabled={!scrollNextVisible}
            onClick={() => categoriesRef.current?.scroll(scrollAmount)}
            arrowDirection="right"
          />
        </div>
      </div>
      <button
        style={{
          "alignItems": "center",
          "backgroundColor": "white",
          "borderRadius": "10px 10px 10px 10px",
          "border": "1px solid var(--whisper-grey)",
          "boxSizing": "border-box",
          "display": "flex",
          "flexDirection": "row",
          "gap": "10px",
          "gridColumn": "3",
          "height": "60%",
          "justifyContent": "center",
          "padding": "10px",
          "cursor": "pointer",
        }}
        type="button"
        onClick={() => true}
      >
        <svg style={{
          "display": "block",
          "height": "14px",
          "width": "14px",
        }} viewBox="0 0 16 16">
          <path d="M5 8a3 3 0 0 1 2.83 2H14v2H7.83A3 3 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.83 4H2V4h6.17A3 3 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
        </svg>
        <div>Filters</div>
      </button>
    </article>
  )
}

type CategoriesHandle = {
  scroll: (arg0: number) => void;
}
interface CategoriesProps {
  setScrollPreviousVisible: React.Dispatch<React.SetStateAction<boolean>>
  setScrollNextVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const Categories = forwardRef<CategoriesHandle, CategoriesProps>(
  ({ setScrollPreviousVisible, setScrollNextVisible }, ref) => {
    const [categories, setCategories] = React.useState<{ id: string, name: string }[]>([])
    const [selectedIndex, setSelectedIndex] =
      React.useState<number | undefined>()

    const formRef = React.useRef<HTMLFormElement>(null)

    const minmax = (n: number, min: number, max: number) =>
      Math.min(Math.max(n, min), max)

    const getScrollMax = () => formRef.current?.scrollLeftMax ?? 0

    function scroll(scrollAmount: number) {
      const scrollPosition = formRef.current?.scrollLeft ?? 0

      const nextScrollPosition = minmax(
        scrollPosition + scrollAmount,
        0,
        getScrollMax()
      )

      formRef.current?.scrollTo({
        left: nextScrollPosition, behavior: 'smooth'
      })

      updateScrollButtonVisibility(nextScrollPosition)
    }

    // Assigns scroll as a function callable from outside the component
    useImperativeHandle(ref, () => ({
      scroll,
    }));

    function updateScrollButtonVisibility(scrollPosition?: number) {
      scrollPosition = scrollPosition ?? formRef.current?.scrollLeft ?? 0

      const scrollButtonVisibilityThreshold = 20

      setScrollPreviousVisible(scrollPosition > scrollButtonVisibilityThreshold)

      setScrollNextVisible(
        scrollPosition < getScrollMax() - scrollButtonVisibilityThreshold
      )
    }

    useEffect(() => { updateScrollButtonVisibility() })

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

    // useEffect(() => {
    //   async function fetchPlaces() {
    //     const selectedCategoryId = categories[selectedIndex].id

    //     // const data = await (await fetch(API_root + '/places_search', {
    //     //   'method': 'post',
    //     //   'body': JSON.stringify({
    //     //     'category': selectedCategoryId
    //     //   })
    //     // })).json()
    //   }

    //   fetchPlaces()
    // }, [selectedIndex])

    return (
      <form
        ref={formRef}
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
              className={`category`}
              css={{
                // "animation": `${styles.fade_color_out} ${fade_duration}s ease-out forwards`,
                // "borderBottom": "solid 2px transparent",
                // "color": "var(--unfocused-text-color)",
                "paddingBottom": "12px",
                "alignItems": "center",
                "boxSizing": "border-box",
                "display": "flex",
                "flexDirection": "column",
                "flexWrap": "nowrap",
                "fontSize": "12px",
                "height": "100%",
                "justifyContent": "space-around",
                ":hover": index !== selectedIndex && {
                  "animation": `${animations.fade_color_in} ${fade_duration} ease-in forwards`,
                },
                ...(index === selectedIndex && {
                  "color": "var(--focused-text-color)",
                  "borderBottom": "solid 2px black"
                })
              }}
              title={category_name}
              key={category_id}
              onClick={() => {
                setSelectedIndex(index)
                renderSearch(category_id)
              }}
              onMouseDown={_ => scale(_.currentTarget!, 0.95)}
              onMouseUp={_ => scale(_.currentTarget!, 1)}
            >
              <div
                ref={animationContainerRef}
                style={{
                  'display': 'inherit',
                  'flexDirection': 'inherit',
                  'alignItems': 'inherit',
                  'justifyContent': 'inherit',
                }}
              >
                <span style={{
                  "display": "flex",
                  "height": "40px",
                  "margin": "5px",
                  "textAlign": "center",
                  "alignItems": "center",
                  "width": "40px"
                }}>
                  <img src="../static/images/house_icon.jpg"
                    css={{
                      "height": "100%",
                      "width": "100%",
                    }}
                  />
                </span>
                <span>{category_name}</span>
              </div>
            </li>
          })
        }
      </form>
    )
  })


interface ScrollCategoriesButtonProps {
  disabled: boolean
  onClick: () => void
  arrowDirection: "left" | "right"
}
function ScrollCategoriesButton({ disabled, onClick, arrowDirection }: ScrollCategoriesButtonProps) {

  const degrees = arrowDirection === "left" ? 45 : 135

  return <button
    className="scroll_button"
    disabled={disabled}
    style={{
      "cursor": disabled ? "default" : "pointer",
    }}
    type="button"
    onClick={onClick}
  >
    <div style={{
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      height: "100%",
      maxWidth: "7px",
      overflow: "hidden",
      transform: arrowDirection == "right" && "rotate(180deg)",
    }}>
      <div
        className="scroll_button_arrow"
        style={{
          "transform": `rotate(45deg)`,
          "margin": "1px",
          "minWidth": "7.5px",
          "minHeight": "7.5px",
          "borderBottom": "2px solid black",
          "borderLeft": "2px solid black",
          "backgroundColor": "transparent",
          "borderRadius": "0 1.5px",
          "boxSizing": "border-box",
        }} />
    </div>
  </button>
}
