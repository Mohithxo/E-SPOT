document.addEventListener('DOMContentLoaded', function () { 
    const imageContainers = document.querySelectorAll('.follow-box .image-container'); 
 
    imageContainers.forEach(function (container) { 
        container.addEventListener('mousedown', function () { 
            container.classList.add('dragging'); 
        }); 
 
        container.addEventListener('mouseup', function () { 
            container.classList.remove('dragging'); 
        }); 
 
 
        container.addEventListener('mouseleave', function () { 
            container.classList.remove('dragging'); 
        }); 
    }); 
}); 
 
function toggleText(imageNumber) { 
    // Hide all texts initially 
    hideAllTexts(); 
   
    // Toggle the visibility of the text for the clicked image 
    var textId = "text" + imageNumber; 
    var textElement = document.getElementById(textId); 
    textElement.classList.toggle("hidden"); 
} 
   
  function hideAllTexts() { 
    // Hide all text elements 
    var textElements = document.querySelectorAll('.icon-container p'); 
    textElements.forEach(function(element) { 
        element.classList.add('hidden'); 
    }); 
}
