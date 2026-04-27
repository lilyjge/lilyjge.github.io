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