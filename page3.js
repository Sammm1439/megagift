const text = "okay so, know that i love you soooooo much babyy ❤️";
const typeText = document.getElementById("typeText");
const nextBtn = document.getElementById("nextBtn");

let index = 0;

function typeWriter() {
  if (index < text.length) {
    typeText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  } else {
    // Show button after typing finishes
    setTimeout(() => {
      nextBtn.classList.add("show");
    }, 800);
  }
}

window.onload = () => {
  typeWriter();
};

nextBtn.addEventListener("click", () => {
  window.location.href = "page4.html";
});
