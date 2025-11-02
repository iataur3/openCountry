//public-login.js
document.addEventListener("DOMContentLoaded", () => {
  showSection("verify");

  // 👁️ Password show/hide toggle logic
  window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    const isHidden = input.type === "password"; // ✅ Correct check
    input.type = isHidden ? "text" : "password"; // 🔁 Toggle type
    icon.textContent = isHidden ? "👁️" : "👁️";
  };
});

// 🔄 Section toggle
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "verify") loadVerify();
}
window.showSection = showSection; // Exposing to global scope
