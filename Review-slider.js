document.addEventListener("DOMContentLoaded", function () { 
  const reviewContainer = document.querySelector(".review-container"); 
  const reviewBoxes = document.querySelectorAll(".review-box"); 
  let currentIndex = 0; 
 
  function nextSlide() { 
    currentIndex = (currentIndex + 1) % reviewBoxes.length; 
    updateTransform(); 
  } 
 
  function updateTransform() { 
    const translateValue = -currentIndex * 30 + "%"; // 30% is the width of 
each box 
    reviewContainer.style.transform = `translateX(${translateValue})`; 
  } 
 
  // Clone all review boxes and append them to the end 
  const reviewBoxClones = Array.from(reviewBoxes).map((box) => 
box.cloneNode(true)); 
  reviewBoxClones.forEach((clone) => reviewContainer.appendChild(clone)); 
 
  // Automatically slide every 3 seconds 
  setInterval(nextSlide, 3000); 
});
