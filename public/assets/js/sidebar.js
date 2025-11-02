document.addEventListener("DOMContentLoaded", async () => {
  // showChapter("intro");

  const homeToggle = document.getElementById("homeToggle");
  const sidebar = document.getElementById("sidebar");
  const chapterSidebar = document.getElementById("chapterNavSidebar");
  const mainContent = document.getElementById("mainContent");
  // --- Sidebar Toggle ---
  homeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = sidebar.classList.contains("hidden");

    if (isHidden) {
      sidebar.classList.remove("hidden");
      chapterSidebar.classList.remove("hidden");
      mainContent.classList.remove("shifted");
    } else {
      sidebar.classList.add("hidden");
      chapterSidebar.classList.add("hidden");
      mainContent.classList.add("shifted");
    }
  });

  // ✅ Load country list dynamically
  const countryList = document.getElementById("country-list");
  try {
    const res = await fetch("assets/json/countries.json");
    if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
    const countries = await res.json();

    countries.forEach((country) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `${country.slug}.html`;
      a.className = "country-link";

      const img = document.createElement("img");
      img.src = `https://flagcdn.com/48x36/${country.flag}.webp`;
      img.className = "country-flag";

      const span = document.createElement("span");
      span.className = "country-name";
      span.textContent = country.name;

      a.appendChild(img);
      a.appendChild(span);
      li.appendChild(a);
      countryList.appendChild(li);
    });

    const savedScroll = parseInt(localStorage.getItem("sidebarScroll"), 10);
    if (!isNaN(savedScroll) && savedScroll >= 0) {
      requestAnimationFrame(() => {
        sidebar.scrollTop = savedScroll;
      });
    }
  } catch (err) {
    console.error("❌ Country list load failed:", err.message);
    countryList.innerHTML = `
      <li><a href="index.html" class="country-link">Home</a></li>
    `;
  }
  // Highlight active link
  const currentPath =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";
  const sidebarLinks = document.querySelectorAll(".sidebar-list a");

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href").toLowerCase();
    if (href === currentPath) {
      link.classList.add("active");
    }

    link.addEventListener("click", () => {
      localStorage.setItem("sidebarScroll", sidebar.scrollTop);
    });
  });

  // chapterNavList
  const chapterNavList = document.getElementById("chapterNavList");

  try {
    const res = await fetch("assets/json/chapterNav.json");
    if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
    const chapters = await res.json();

    chapters.forEach((chapter) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = chapter.label || "Unnamed Chapter";
      btn.setAttribute("data-id", chapter.id || "unknown"); // ✅ এই লাইনটা খুব গুরুত্বপূর্ণ
      btn.addEventListener("click", () => showChapter(chapter.id || "unknown"));
      li.appendChild(btn);
      chapterNavList.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Chapter navigation JSON fetch error:", err.message);
    chapterNavList.innerHTML = `<li>No chapters available</li>`;
  }
});

// --- Chapter Navigation ---
function showChapter(id) {
  const validIds = [
    "intro",
    "timeline",
    "tradition",
    "weather",
    "tourism",
    "economy",
    "education",
    "technology",
    "politics",
    "law",
    "military",
    "relations",
    "civic",
  ];
  if (!validIds.includes(id)) return;

  document.querySelectorAll(".chapter").forEach((el) => {
    el.classList.toggle("hidden", el.id !== id);
  });

  document.querySelectorAll("#chapterNavSidebar button").forEach((btn) => {
    const btnId = btn.getAttribute("data-id");
    btn.classList.toggle("active", btnId === id);
  });
}
