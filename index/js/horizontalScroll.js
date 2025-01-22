document.addEventListener("DOMContentLoaded", () => {
  const eventScrollContainer = document.querySelector(".event-cards");
  const vinylScrollContainer = document.querySelector(".vinyl-cards");

  const eventLeftArrow = document.querySelector("#events .left-arrow");
  const eventRightArrow = document.querySelector("#events .right-arrow");

  const vinylLeftArrow = document.querySelector("#vinyls .left-arrow");
  const vinylRightArrow = document.querySelector("#vinyls .right-arrow");

  // Shared scroll functionality for both sections
  function scrollLeft(container, arrowLeft, arrowRight) {
    const scrollDistance = calculateScrollDistance(container);
    container.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth'
    });
    updateArrowVisibility(container, arrowLeft, arrowRight);
  }

  function scrollRight(container, arrowLeft, arrowRight) {
    const scrollDistance = calculateScrollDistance(container);
    container.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
    updateArrowVisibility(container, arrowLeft, arrowRight);
  }

  // Function to calculate scroll distance
  function calculateScrollDistance(container) {
    const containerWidth = container.offsetWidth;
    const items = container.querySelectorAll('.event, .vinyl'); // Handle both event and vinyl items
    let totalWidth = 0;
    let visibleItemsCount = 0;
    let scrollDistance = 0;

    // Calculate the total width of visible items minus one item
    for (let i = 0; i < items.length; i++) {
      const itemStyle = window.getComputedStyle(items[i]);
      const itemWidth = items[i].offsetWidth + parseFloat(itemStyle.marginRight); // Width including margin
      totalWidth += itemWidth;

      if (totalWidth > containerWidth) break;
      visibleItemsCount++;
    }

    // Scroll distance is the width of all visible items minus a small buffer (10% reduction)
    if (visibleItemsCount > 1) {
      scrollDistance = totalWidth - (items[visibleItemsCount - 1].offsetWidth + parseFloat(window.getComputedStyle(items[visibleItemsCount - 1]).marginRight));
    } else {
      scrollDistance = totalWidth;
    }

    scrollDistance *= 0.9; // Reduce the scroll by 10%
    return scrollDistance;
  }

  // Update the visibility of arrows
  function updateArrowVisibility(container, leftArrow, rightArrow) {
    if (container.scrollLeft === 0) {
      leftArrow.style.display = 'none';
    } else {
      leftArrow.style.display = 'block';
    }

    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      rightArrow.style.display = 'none';
    } else {
      rightArrow.style.display = 'block';
    }
  }

  // Function to setup independent scrolling and arrow visibility for a section
  function setupIndependentScroll(container, leftArrow, rightArrow) {
    function showArrows() {
      leftArrow.style.opacity = '1';
      rightArrow.style.opacity = '1';
    }

    function hideArrows() {
      leftArrow.style.opacity = '0';
      rightArrow.style.opacity = '0';
    }

    leftArrow.addEventListener('click', () => scrollLeft(container, leftArrow, rightArrow));
    rightArrow.addEventListener('click', () => scrollRight(container, leftArrow, rightArrow));

    container.addEventListener('mouseenter', showArrows);
    container.addEventListener('mouseleave', hideArrows);
    leftArrow.addEventListener('mouseenter', showArrows);
    leftArrow.addEventListener('mouseleave', hideArrows);
    rightArrow.addEventListener('mouseenter', showArrows);
    rightArrow.addEventListener('mouseleave', hideArrows);

    container.addEventListener('scroll', () => {
      updateArrowVisibility(container, leftArrow, rightArrow);
    });

    // Initial arrow visibility check
    updateArrowVisibility(container, leftArrow, rightArrow);
  }

  // Setup scroll functionality for both event-cards and vinyl-cards
  setupIndependentScroll(eventScrollContainer, eventLeftArrow, eventRightArrow);
  setupIndependentScroll(vinylScrollContainer, vinylLeftArrow, vinylRightArrow);
});
