var slideIndex = 0; 
var interval; 
function startAutoSlide() { 
  showSlides(slideIndex); 
  interval = setInterval(function () { 
    plusSlides(1); 
  }, 3000); 
} 
 
function stopAutoSlide() { 
  clearInterval(interval); 
} 
 
function plusSlides(n) { 
  stopAutoSlide(); // Stop auto sliding when manual navigation occurs 
  showSlides((slideIndex += n)); 
  startAutoSlide(); // Restart auto sliding after manual navigation 
} 
 
function currentSlide(n) { 
  stopAutoSlide(); // Stop auto sliding when manual navigation occurs 
  showSlides((slideIndex = n)); 
  startAutoSlide(); // Restart auto sliding after manual navigation 
} 
 
function showSlides(n) { 
  var i; 
  var slides = document.getElementsByClassName("mySlides"); 
  var dots = document.getElementsByClassName("dot"); 
 
  if (n >= slides.length) { 
    slideIndex = 0; 
  } 
  if (n < 0) { 
    slideIndex = slides.length - 1; 
  } 
 
  for (i = 0; i < slides.length; i++) { 
    slides[i].style.display = "none"; 
  } 
 
for (i = 0; i < dots.length; i++) { 
dots[i].className = dots[i].className.replace(" active", ""); 
} 
slides[slideIndex].style.display = "block"; 
dots[slideIndex].className += " active"; 
} 
startAutoSlide(); 
