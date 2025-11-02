const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");

// --- Search Functionality ---
let debounceTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    performSearch();
  }, 300);
});

function performSearch() {
  const query = searchInput.value.toLowerCase();
  let localMatch = false;
  // 🔍 Local chapter filtering
  document.querySelectorAll(".chapter").forEach((chapter) => {
    const text = chapter.textContent.toLowerCase();
    const match = text.includes(query);
    chapter.classList.toggle("hidden", !match);
    if (match) localMatch = true;
  });
  // 🌐 Cross-page search fallback
  if (!localMatch && query.length > 2) {
    resultsContainer.innerHTML = "";
    const pages = ["bangladesh.html", "index.html", "us.html", "rusia.html"];
    pages.forEach(async (page) => {
      try {
        const res = await fetch(page);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const text = await res.text();
        if (text.toLowerCase().includes(query)) {
          const result = document.createElement("div");
          result.textContent = `${page}: Match found`;
          result.classList.add("search-match");
          result.addEventListener("click", () => {
            window.location.href = page;
          });
          resultsContainer.appendChild(result);
        }
      } catch (err) {
        console.warn(`❌ ${page} fetch error:`, err.message);
      }
    });
  } else {
    resultsContainer.innerHTML = "";
  }
}
