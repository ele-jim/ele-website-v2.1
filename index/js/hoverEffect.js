document.addEventListener("DOMContentLoaded", function () {
    var containers = document.querySelectorAll(
      ".event .container, .vinyl .container"
    );
  
    function toggleLinks(container, enable) {
      var links = container.querySelectorAll("a");
      links.forEach(function (link) {
        if (enable) {
          link.classList.remove("disabled-link");
        } else {
          link.classList.add("disabled-link");
        }
      });
    }
  
    function clearAllTapped() {
      containers.forEach(function (container) {
        container.classList.remove("tapped");
        toggleLinks(container, false); // Disable links
      });
    }
  
    containers.forEach(function (container) {
      container.addEventListener("click", function (event) {
        event.stopPropagation();
        clearAllTapped();
  
        if (!event.currentTarget.classList.contains("tapped")) {
          event.currentTarget.classList.add("tapped");
          toggleLinks(event.currentTarget, true); // Enable links
        }
      });
    });
  
    document.body.addEventListener("click", function () {
      clearAllTapped();
    });
  });
  