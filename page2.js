const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

// NO button escapes cursor
noBtn.addEventListener("mouseover", () => {

  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";

});

// YES button action
yesBtn.addEventListener("click", () => {

  document.body.style.transition = "1s";
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "page3.html";
  }, 1000);

});
