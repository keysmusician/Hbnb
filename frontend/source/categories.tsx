import React, { forwardRef, useEffect, useImperativeHandle } from "react"


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

  const [scrollPreviousVisible, setScrollPreviousVisible] = React.useState(false)

  const [scrollNextVisible, setScrollNextVisible] = React.useState(false)

  const categoriesRef = React.useRef<CategoriesHandle>(null)

  const scrollAmount = 500

  const scroll_button_arrow_style = {
    "transform": "rotate(45deg)",
    "margin": "1px",
    "width": "35%",
    "height": "35%",
    "borderBottom": "2px solid black",
    "borderLeft": "2px solid black",
    "backgroundColor": "transparent",
    "borderRadius": "0 2px",
    "boxSizing": "border-box",
  }

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
          <button
            className="scroll_button"
            disabled={!scrollPreviousVisible}
            style={{
              "cursor": scrollPreviousVisible ?
                "pointer" : "default"
            }}
            type="button"
            onClick={(event) => categoriesRef.current?.scroll(-scrollAmount)}
          >
            <div
              className="scroll_button_arrow"
              style={scroll_button_arrow_style}
            />
          </button>
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
          <button
            className="scroll_button"
            disabled={!scrollNextVisible}
            style={{ "cursor": scrollNextVisible ? "pointer" : "default" }}
            type="button"
            onClick={() => categoriesRef.current?.scroll(scrollAmount)}
          >
            <div className="scroll_button_arrow" style={{
              ...scroll_button_arrow_style,
              "transform": "rotate(-135deg)"
            }} />
          </button>
        </div>
      </div>
      <button className="filters_button" type="button">
        <img />
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
          categories.map((category, index) => {
            const selected = index === selectedIndex ? "category_selected" : ""

            return <li
              className={`category ${selected}`}
              key={index}
              onClick={() => setSelectedIndex(index)}
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
                <span className="category_icon">[Img]</span>
                <span>{category}</span>
              </div>
            </li>
          })
        }
      </form>
    )
  })
