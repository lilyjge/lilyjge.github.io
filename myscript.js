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
  var staggerMs = 100;
  var revealOrder = new Map();

  reveals.forEach(function (el, index) {
    revealOrder.set(el, index);
  });

  function revealElement(el) {
    el.classList.add("is-revealed");
  }

  function revealAll() {
    reveals.forEach(function (el) {
      revealElement(el);
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
      var intersectingEntries = entries.filter(function (entry) {
        return entry.isIntersecting;
      });

      intersectingEntries.sort(function (a, b) {
        return (revealOrder.get(a.target) || 0) - (revealOrder.get(b.target) || 0);
      });

      intersectingEntries.forEach(function (entry, index) {
        if (!entry.isIntersecting) return;
        window.setTimeout(function () {
          revealElement(entry.target);
        }, index * staggerMs);
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