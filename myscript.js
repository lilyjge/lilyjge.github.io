var yearEl = document.getElementById("footer-year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

var toggleDisplay = document.querySelector("#disnav");
var fixed = document.querySelector(".fixed");
var html = document.querySelector("html");
var navLinks = document.querySelectorAll(".menu > ul > li");

if (toggleDisplay && fixed && html) {
  toggleDisplay.addEventListener("click", function () {
    if (fixed.style.left === "0px") {
      fixed.style.left = "-100%";
      html.style.overflowY = "visible";
    } else {
      fixed.style.left = "0px";
      html.style.overflowY = "hidden";
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      fixed.style.left = "-100%";
      html.style.overflowY = "visible";
    });
  });
}

(function () {
  var reveals = document.querySelectorAll("#main .scroll-reveal");
  if (!reveals.length) return;

  function revealAll() {
    reveals.forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      /* Modest lead below the viewport: big enough to avoid “empty” sections and
         a stuck footer, but not so large that the 1s animation finishes off-screen
         when scrolling slowly. */
      rootMargin: "0px 0px 2% 0px",
      threshold: 0,
    }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();