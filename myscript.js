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