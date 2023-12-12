document.addEventListener("DOMContentLoaded", function () {
  const copyTextButton = document.getElementById("copy-icon");
  const zoomedImage = document.getElementById("zoomedImage");
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");

  let zoomLevel = 1; // Initial zoom level

  copyTextButton.addEventListener("click", function () {
    const textToCopy = document.querySelector(".upper-right-card p").innerText;
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

    // Optionally, provide feedback to the user
    alert("Text copied to clipboard!");
  });

  zoomInButton.addEventListener("click", function () {
    zoomLevel += 0.1;
    applyZoom();
  });

  zoomOutButton.addEventListener("click", function () {
    zoomLevel -= 0.1;
    applyZoom();
  });

  function applyZoom() {
    // Limit the zoom level between 0.5 and 2 for better control
    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 2);
    zoomedImage.style.transform = `scale(${zoomLevel})`;
    zoomedImage.style.transformOrigin = 'top left'; // Set the transform origin to the top left corner
  }


  const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
      const startX = e.clientX;
      const thumbPosition = scrollbarThumb.offsetLeft;
      const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

      // Update thumb position on mouse move
      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const newThumbPosition = thumbPosition + deltaX;

        // Ensure the scrollbar thumb stays within bounds
        const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
        const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

        scrollbarThumb.style.left = `${boundedPosition}px`;
        imageList.scrollLeft = scrollPosition;
      };

      // Remove event listeners on mouse up
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      // Add event listeners for drag interaction
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    // Slide images according to the slide button clicks
    slideButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.id === "prev-slide" ? -1 : 1;
        const scrollAmount = imageList.clientWidth * direction;
        imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });

    // Show or hide slide buttons and scrollbar based on scroll position
    const handleSlideButtonsAndScrollbar = () => {
      const showPrevButton = imageList.scrollLeft > 0;
      const showNextButton = imageList.scrollLeft < maxScrollLeft;
      const showScrollbar = maxScrollLeft > 0; // Check if scrolling is needed

      slideButtons[0].style.display = showPrevButton ? "flex" : "none";
      slideButtons[1].style.display = showNextButton ? "flex" : "none";
      sliderScrollbar.style.display = showScrollbar ? "block" : "none";
    };

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
      const scrollPosition = imageList.scrollLeft;
      const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
      scrollbarThumb.style.left = `${thumbPosition}px`;
    };

    // Call these two functions when the image list scrolls
    imageList.addEventListener("scroll", () => {
      updateScrollThumbPosition();
      handleSlideButtonsAndScrollbar();
    });

    // Call the function on initial load
    handleSlideButtonsAndScrollbar();
  };

  // Call initSlider on window resize and load
  window.addEventListener("resize", initSlider);
  window.addEventListener("load", initSlider);
});
