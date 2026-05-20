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

if (toggleDisplay && fixed && html) {
  function openNav() {
    fixed.style.left = "0px";
    toggleDisplay.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    fixed.style.left = "-100%";
    toggleDisplay.setAttribute("aria-expanded", "false");
  }

  toggleDisplay.setAttribute("aria-expanded", "false");

  toggleDisplay.addEventListener("click", function () {
    if (fixed.style.left === "0px") {
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

  var linkById = {};
  navAnchors.forEach(function (anchor) {
    linkById[anchor.getAttribute("href").slice(1)] = anchor;
  });

  var scrollOffset = 100;

  function setActive(id) {
    Object.keys(linkById).forEach(function (key) {
      linkById[key].classList.toggle("is-active", key === id);
    });
  }

  function sectionTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function updateActiveFromScroll() {
    var marker = window.scrollY + scrollOffset;
    var activeId = sections[0].id;

    for (var i = sections.length - 1; i >= 0; i--) {
      if (sectionTop(sections[i].el) <= marker) {
        activeId = sections[i].id;
        break;
      }
    }

    setActive(activeId);
  }

  var ticking = false;
  function onScroll() {
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
      var id = anchor.getAttribute("href").slice(1);
      window.setTimeout(function () {
        setActive(id);
      }, 80);
    });
  });
})();
