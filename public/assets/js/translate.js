document.addEventListener("DOMContentLoaded", () => {
  loadLanguages();

  // language change function
  let currentLang = "en";
  async function loadLanguages() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.innerHTML = "";

    let fallback = [
      { code: "en", name: "English" },
      { code: "bn", name: "Bengali" },
    ];

    try {
      const res = await fetch("https://libretranslate.com/languages");
      if (!res.ok) throw new Error("API error");
      let langs = await res.json();

      fallback.forEach((fb) => {
        const found = langs.find((l) => l.code === fb.code);
        if (found) {
          addLangOption(found.code, found.name);
        }
      });

      langs.forEach((lang) => {
        if (lang.code !== "en" && lang.code !== "bn") {
          addLangOption(lang.code, lang.name);
        }
      });
    } catch {
      fallback.forEach((lang) => {
        addLangOption(lang.code, lang.name);
      });
      dropdown.innerHTML += `<div style="padding:6px 12px; color:#999;">API Error</div>`;
    }
  }

  // --- Add Language Option ---
  function addLangOption(code, label) {
    const dropdown = document.getElementById("languageDropdown");
    const item = document.createElement("div");
    item.textContent = label;
    item.style.padding = "6px 12px";
    item.style.cursor = "pointer";
    item.addEventListener("click", async () => {
      currentLang = code;
      document.documentElement.lang = currentLang;
      dropdown.style.display = "none";
    });
    dropdown.appendChild(item);
  }

  // --- Toggle Dropdown on Icon Click ---
  document
    .getElementById("languageButton")
    .addEventListener("click", function () {
      const dropdown = document.getElementById("languageDropdown");
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });

  // --- Hide Dropdown on Outside Click ---
  document.addEventListener("click", function (e) {
    const btn = document.getElementById("languageButton");
    const dropdown = document.getElementById("languageDropdown");
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // --- Text Selection Translation ---
  document.addEventListener("mouseup", async function () {
    const selection = window.getSelection();
    const text = selection && selection.toString().trim();
    if (text && currentLang !== "en") {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let tooltip = document.getElementById("translateTooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "translateTooltip";
        tooltip.style.position = "absolute";
        tooltip.style.background = "#686363ff";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.padding = "6px 12px";
        tooltip.style.borderRadius = "6px";
        tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        tooltip.style.zIndex = 9999;
        tooltip.style.fontSize = "15px";
        tooltip.style.maxWidth = "80%";
        tooltip.style.wordWrap = "break-word";
        tooltip.style.display = "none";
        document.body.appendChild(tooltip);
      }

      tooltip.textContent = "Translating...";
      tooltip.style.display = "block";

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      tooltip.style.left = rect.left + scrollLeft + "px";
      tooltip.style.top = rect.bottom + scrollTop + 5 + "px";
      tooltip.style.transform = "none";

      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
          )}&langpair=en|${currentLang}`
        );
        const data = await res.json();
        tooltip.textContent =
          data.responseData.translatedText || "Translation error";
      } catch {
        tooltip.textContent = "Translation error";
      }
    } else {
      const tooltip = document.getElementById("translateTooltip");
      if (tooltip) tooltip.style.display = "none";
    }
  });
});
