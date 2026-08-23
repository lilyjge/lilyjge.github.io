var yearEl = document.getElementById("footer-year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

(function () {
  var listeningRow = document.querySelector(".now-listening");
  var spotifyEl = document.getElementById("spotify-now");
  if (!listeningRow || !spotifyEl) return;

  var endpoint = listeningRow.getAttribute("data-spotify-endpoint");
  if (!endpoint) return;

  function setFallback() {
    spotifyEl.classList.add("now-placeholder");
    spotifyEl.textContent = "[recent song unavailable]";
  }

  function renderTrack(track) {
    if (!track || !track.title) {
      setFallback();
      return;
    }

    spotifyEl.classList.remove("now-placeholder");
    spotifyEl.classList.add("spotify-track");
    spotifyEl.textContent = "";

    if (track.albumImageUrl) {
      var img = document.createElement("img");
      img.className = "spotify-art";
      img.src = track.albumImageUrl;
      img.alt = "";
      img.loading = "lazy";
      spotifyEl.appendChild(img);
    }

    var text = document.createElement("span");
    text.className = "spotify-text";

    var prefix = document.createElement("span");
    prefix.className = "spotify-status";
    prefix.textContent = track.isPlaying ? "now playing" : "recently played";
    text.appendChild(prefix);

    var title = document.createElement(track.songUrl ? "a" : "span");
    title.className = "spotify-title";
    title.textContent = track.title + " - " + track.artist;
    if (track.songUrl) {
      title.href = track.songUrl;
      title.target = "_blank";
      title.rel = "noopener noreferrer";
    }
    text.appendChild(title);

    spotifyEl.appendChild(text);
  }

  fetch(endpoint, { headers: { Accept: "application/json" } })
    .then(function (response) {
      if (!response.ok) throw new Error("Spotify request failed");
      return response.json();
    })
    .then(renderTrack)
    .catch(setFallback);
})();

var toggleDisplay = document.querySelector("#disnav");
var fixed = document.querySelector(".fixed");
var html = document.querySelector("html");
var navLinks = document.querySelectorAll(".menu > ul > li");
var themeColor = document.querySelector("meta[name='theme-color']");

if (toggleDisplay && fixed && html) {
  function openNav() {
    fixed.classList.add("is-open");
    html.classList.add("nav-open");
    toggleDisplay.setAttribute("aria-expanded", "true");
    if (themeColor) themeColor.setAttribute("content", "#D7C5D8");
  }

  function closeNav() {
    fixed.classList.remove("is-open");
    html.classList.remove("nav-open");
    toggleDisplay.setAttribute("aria-expanded", "false");
    if (themeColor) themeColor.setAttribute("content", "#faf5ff");
  }

  toggleDisplay.setAttribute("aria-expanded", "false");

  toggleDisplay.addEventListener("click", function () {
    if (fixed.classList.contains("is-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeNav();
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
      /* Wait until an element is slightly inside the viewport before revealing
         it, so the fade remains visible instead of starting below the fold. */
      rootMargin: "0px 0px -6% 0px",
      threshold: 0,
    }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

/* Scroll-spy: show > next to the section currently in view */
(function () {
  var navAnchors = document.querySelectorAll(".menu a[href^='#']");
  if (!navAnchors.length) return;

  var sections = [];
  navAnchors.forEach(function (anchor) {
    var id = anchor.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) {
      sections.push({ id: id, el: section });
    }
  });

  if (!sections.length) return;

  function setActive(id) {
    navAnchors.forEach(function (anchor) {
      var isActive = anchor.getAttribute("href") === "#" + id;
      anchor.classList.toggle("is-active", isActive);
      if (isActive) {
        anchor.setAttribute("aria-current", "location");
      } else {
        anchor.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveFromScroll() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var distanceFromBottom =
      document.documentElement.scrollHeight - (window.scrollY + viewportHeight);
    var activeId = sections[0].id;

    /* The current section is the last one whose top has crossed a small
       activation line near the top of the viewport. */
    var activationLine = Math.min(viewportHeight * 0.25, 160);
    sections.forEach(function (section) {
      if (section.el.getBoundingClientRect().top <= activationLine) {
        activeId = section.id;
      }
    });

    /* The final section may not be tall enough to cross the activation line. */
    if (distanceFromBottom <= 8) {
      activeId = sections[sections.length - 1].id;
    }

    setActive(activeId);
  }

  var ticking = false;
  var clickedId = null;
  var clickScrollTimer = null;

  function finishClickScroll() {
    window.clearTimeout(clickScrollTimer);
    clickScrollTimer = window.setTimeout(function () {
      clickedId = null;
      updateActiveFromScroll();
    }, 150);
  }

  function onScroll() {
    if (clickedId) {
      setActive(clickedId);
      finishClickScroll();
      return;
    }
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActiveFromScroll();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateActiveFromScroll();

  navAnchors.forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      clickedId = anchor.getAttribute("href").slice(1);
      setActive(clickedId);
      finishClickScroll();
    });
  });
})();
