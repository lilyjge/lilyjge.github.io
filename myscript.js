var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}


var toggledisplay = document.querySelector('#disnav');
var fixed = document.querySelector('.fixed');
//var navbar = document.querySelector('#nav');
var content = document.querySelector('html');
// add a click event listener to the div
toggledisplay.addEventListener('click', function() {
  // specify the action to take when the div is clicked
  if(fixed.style.left == "0px"){
    fixed.style.left = "-100%";
    content.style.overflowY = "visible";
  }
  else{
    fixed.style.left = "0px";
    content.style.overflowY = "hidden";
  }
});

var navlinks = document.querySelectorAll('.menu > ul > li');
for(i = 0; i < navlinks.length; i++){
  navlinks[i].addEventListener("click", function(){
    fixed.style.left = "-100%";
    content.style.overflowY = "visible";
  });
}

// Photo Modal Functionality
function openModal(element) {
  var modal = document.getElementById("photoModal");
  var modalImg = document.getElementById("modalImg");
  var img = element.querySelector('img');
  
  modal.style.display = "flex";
  modalImg.src = img.src;
  modalImg.alt = img.alt;
}

function closeModal() {
  var modal = document.getElementById("photoModal");
  modal.style.display = "none";
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  var modal = document.getElementById("photoModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    var modal = document.getElementById("photoModal");
    modal.style.display = "none";
  }
});