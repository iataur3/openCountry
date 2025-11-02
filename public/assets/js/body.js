document.addEventListener("DOMContentLoaded", async () => {
  const footerElement = document.getElementById("dynamicFooter");

  fetch("assets/json/footerContent.json")
    .then((res) => res.json())
    .then((data) => {
      footerElement.innerHTML = data.footer;
    })
    .catch((err) => {
      console.error("Footer JSON fetch error:", err);
      footerElement.textContent = "© 2025 Open History. All rights reserved.";
    });
});
