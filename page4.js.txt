const text = "hope you like this, and pls allow your camera and mic for the best experience ❤️";
const typeText = document.getElementById("typeText");
const warning = document.getElementById("warning");

let index = 0;

// Typewriter effect
function typeWriter() {
  if (index < text.length) {
    typeText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 50);
  } else {
    // After typing, ask for camera & mic automatically
    requestCameraMic();
  }
}

window.onload = () => typeWriter();

async function requestCameraMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Access granted → go to next page
    window.location.href = "page5.html";
  } catch (err) {
    // Access denied → show warning
    warning.innerText = "Pleaseeee allow camera & mic access, otherwise this won’t work baby :(";
    warning.style.opacity = 1;
  }
}
