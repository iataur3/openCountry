document.addEventListener("DOMContentLoaded", () => {
  const popupSection = document.getElementById("popupSection");
  const popupTitle = document.getElementById("popupTitle");
  const popupContent = document.getElementById("popupContent");
  const closePopup = document.getElementById("closePopup");
  const uxBtn = document.getElementById("uxBtn");
  const aboutBtn = document.getElementById("aboutBtn");

  let popupData = {};

  // JSON fetch
  fetch("assets/json/popupContent.json")
    .then((res) => res.json())
    .then((data) => {
      popupData = data;
    })
    .catch((err) => console.error("JSON fetch error:", err));

  // Show popup
  function showPopup(type) {
    if (popupData[type]) {
      popupTitle.textContent = popupData[type].title;
      popupContent.textContent = popupData[type].content;
      popupSection.classList.remove("hidden");
    }
  }

  // Button handlers
  uxBtn.addEventListener("click", () => showPopup("ux"));
  aboutBtn.addEventListener("click", () => showPopup("about"));

  // Close popup
  closePopup.addEventListener("click", () => {
    popupSection.classList.add("hidden");
  });

  // Outside click to close
  popupSection.addEventListener("click", (e) => {
    if (e.target === popupSection) {
      popupSection.classList.add("hidden");
    }
  });
});

//night mode button
const nightBtn = document.getElementById("nightBtn");
// 🕒 page loade check
if (localStorage.getItem("nightMode") === "enabled") {
  document.body.classList.add("night-mode");
  nightBtn.textContent = "✨️";
} else {
  document.body.classList.remove("night-mode");
  nightBtn.textContent = "🌙";
}

// 🖱️ click toggle + localStorage update
nightBtn.addEventListener("click", () => {
  document.body.classList.toggle("night-mode");

  if (document.body.classList.contains("night-mode")) {
    localStorage.setItem("nightMode", "enabled");
    nightBtn.textContent = "✨️";
  } else {
    localStorage.setItem("nightMode", "disabled");
    nightBtn.textContent = "🌙";
  }
});
