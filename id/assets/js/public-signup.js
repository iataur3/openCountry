document.addEventListener("DOMContentLoaded", async function () {
  showSection("signup");
});

// 🔄 Section toggle
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "confirmation") loadConfirmation();
}
window.showSection = showSection; // Exposing to global scope

// 🍞 Toast
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "show";
  setTimeout(() => (t.className = ""), 3000);
}

// 📝 Signup validation
const fields = [
  "s-full-name",
  "s-marital-status",
  "s-religion",
  "s-profession",
  "s-country",
  "s-address",
  "phone",
  "email",
  "password",
  "confirmPassword",
];

fields.forEach((id) => {
  const input = document.getElementById(id);
  const errorDiv = document.getElementById("error_" + id);
  if (!input) return;
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      errorDiv.textContent = "";
      input.classList.remove("input-error");
    }
  });
  if (input.tagName === "SELECT") {
    input.addEventListener("change", () => {
      if (input.value.trim() !== "") {
        errorDiv.textContent = "";
        input.classList.remove("input-error");
      }
    });
  }
});

document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    let hasError = false;
    const data = {};

    fields.forEach((id) => {
      const input = document.getElementById(id);
      const value = input?.value?.trim() || "";
      const errorDiv = document.getElementById("error_" + id);
      errorDiv.textContent = "";
      input?.classList?.remove("input-error");
      if (!value) {
        errorDiv.textContent = "This field is required";
        input?.classList?.add("input-error");
        hasError = true;
      } else {
        data[id] = value;
      }
    });

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      const input = document.getElementById("email");
      const errorDiv = document.getElementById("error_email");
      errorDiv.textContent = "Invalid email address";
      input.classList.add("input-error");
      hasError = true;
    }

    if (data.password.length < 4) {
      const input = document.getElementById("password");
      const errorDiv = document.getElementById("error_password");
      errorDiv.textContent = "Password must be at least 4 characters";
      input.classList.add("input-error");
      hasError = true;
    }

    if (data.password !== data.confirmPassword) {
      const input = document.getElementById("confirmPassword");
      const errorDiv = document.getElementById("error_confirmPassword");
      errorDiv.textContent = "Passwords do not match";
      input.classList.add("input-error");
      hasError = true;
    }

    if (hasError) {
      showToast("Please fix the errors before submitting.");
      return;
    }

    localStorage.setItem("signupData", JSON.stringify(data));
    showToast("Welcome");
    setTimeout(() => showSection("confirmation"), 1500);
  });

// 👁️ Password toggle icon
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.textContent = isHidden ? "🔒" : "👁️";
}
window.togglePassword = togglePassword;

// 📋 Confirmation loader
function loadConfirmation() {
  const raw = localStorage.getItem("signupData");
  let data = {};
  try {
    data = JSON.parse(raw) || {};
  } catch (err) {
    console.warn("Invalid signup data:", err.message);
  }

  const table = document.getElementById("dataTable");
  const noData = document.getElementById("noData");

  if (!Object.keys(data).length) {
    noData.style.display = "block";
    table.style.display = "none";
    return;
  }

  const keys = [
    "s-full-name",
    "s-marital-status",
    "s-religion",
    "s-profession",
    "s-country",
    "s-address",
    "phone",
    "email",
    "password",
  ];

  keys.forEach((key) => {
    const cell = document.getElementById("val_" + key);
    let val = data[key] || "";
    if (key === "password") val = "********";
    if (key === "s-marital-status" || key === "s-religion") {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    cell.textContent = val;
  });

  table.style.display = "table";
  noData.style.display = "none";
}
