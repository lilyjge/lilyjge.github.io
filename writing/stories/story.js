(function () {
  var body = document.querySelector("[data-story-source]");
  if (!body) return;

  var source = body.getAttribute("data-story-source");

  function inlineMarkdown(text) {
    var escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\\([\\`*{}\[\]()#+\-.!_~])/g, "$1");
    return escaped
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  }

  function render(markdown) {
    var lines = markdown.replace(/\r/g, "").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    if (lines.length) lines.shift();

    var paragraphs = [];
    var current = [];
    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) {
        if (current.length) {
          paragraphs.push(current.join(" "));
          current = [];
        }
      } else if (/^~+$/.test(trimmed.replace(/\\/g, ""))) {
        if (current.length) {
          paragraphs.push(current.join(" "));
          current = [];
        }
        paragraphs.push("~");
      } else {
        if (current.length) {
          paragraphs.push(current.join(" "));
          current = [];
        }
        paragraphs.push(trimmed.replace(/\s{2,}$/g, ""));
      }
    });
    if (current.length) paragraphs.push(current.join(" "));

    body.innerHTML = paragraphs.map(function (paragraph) {
      if (paragraph === "~" || paragraph === "\\~") {
        return '<div class="story-divider" aria-hidden="true">~</div>';
      }
      return "<p>" + inlineMarkdown(paragraph) + "</p>";
    }).join("");
  }

  fetch(source)
    .then(function (response) {
      if (!response.ok) throw new Error("Story could not be loaded");
      return response.text();
    })
    .then(render)
    .catch(function () {
      body.innerHTML = '<p class="story-error">This story could not be loaded. Please try opening the page from the website.</p>';
    });
})();
