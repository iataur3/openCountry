document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");

  // let countryPages = {}; // key: lowercase name, value: slug.html
  // let countryLookup = {}; // key: slug, value: country name

  // // 🌍 Load country list from JSON
  // fetch("assets/json/countries.json")
  //   .then((res) => {
  //     if (!res.ok) throw new Error("Failed to load countries.json");
  //     return res.json();
  //   })
  //   .then((data) => {
  //     data.forEach((country) => {
  //       const nameKey = country.name.toLowerCase();
  //       countryPages[nameKey] = `${country.slug}.html`;
  //       countryLookup[country.slug] = country.name;
  //     });
  //   })
  //   .catch((err) => {
  //     console.warn("❌ Country list fetch error:", err.message);
  //   });

  let countryList = []; // array of country objects
  let countryPages = {}; // key: lowercase name, value: slug.html
  let countryLookup = {}; // key: slug, value: country name
  let fuse; // Fuse instance
  // 🌍 Load country list from JSON
  fetch("assets/json/countries.json")
    .then((res) => res.json())
    .then((data) => {
      countryList = data;
      data.forEach((country) => {
        const nameKey = country.name.toLowerCase();
        countryPages[nameKey] = `${country.slug}.html`;
        countryLookup[country.slug] = country.name;
      });

      // ✅ Initialize Fuse.js
      fuse = new Fuse(countryList, {
        keys: ["name"],
        threshold: 0.3, // lower = stricter match
      });
    });

  //debounceTimeout
  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      performSearch();
    }, 300);
  });

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    let localMatch = false;

    // // 🌍 Fuzzy country match
    // const fuzzyResult = fuse.search(query);
    // if (fuzzyResult.length > 0) {
    //   const matchedCountry = fuzzyResult[0].item;
    //   const matchedSlug = matchedCountry.slug;
    //   window.location.href = `${matchedSlug}.html`;
    //   return;
    // }

    // 🌍 Country redirect logic
    if (countryPages[query]) {
      window.location.href = countryPages[query];
      return;
    }

    // ✅ Reset previous highlights
    document.querySelectorAll("u").forEach((u) => {
      const parent = u.parentNode;
      parent.replaceChild(document.createTextNode(u.textContent), u);
    });
    document.querySelectorAll(".highlighted").forEach((el) => {
      el.classList.remove("highlighted");
    });

    // 🔍 Local chapter filtering + article highlighting
    document.querySelectorAll(".chapter").forEach((chapter) => {
      let chapterMatch = false;

      chapter.querySelectorAll(".article").forEach((article) => {
        const text = article.textContent.toLowerCase();
        const match = text.includes(query);
        article.classList.toggle("hidden", !match);

        if (match) {
          highlightMatch(article, query);
          article.classList.add("highlighted");
          chapterMatch = true;
          localMatch = true;
        }
      });

      chapter.classList.toggle("hidden", !chapterMatch);
    });

    // 🌐 Cross-page fallback
    if (!localMatch && query.length > 2) {
      resultsContainer.innerHTML = "";

      const pages = Object.keys(countryLookup)
        .map((slug) => `${slug}.html`)
        .concat(["index.html"]);

      pages.forEach(async (page) => {
        try {
          const res = await fetch(page);
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const html = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const articles = doc.querySelectorAll("article");

          const slug = page.replace(".html", "");
          const countryName = countryLookup[slug] || slug;

          const h1 = doc.querySelector("h1");
          const readableTitle = h1 ? h1.textContent.trim() : countryName;

          articles.forEach((article) => {
            const rawText = article.textContent.toLowerCase();
            if (rawText.includes(query)) {
              const cloned = article.cloneNode(true);
              highlightMatch(cloned, query);

              // ✅ Determine article ID or generate one from heading
              let articleId = article.id;
              if (!articleId) {
                const h3 = article.querySelector("h3");
                if (h3) {
                  articleId = h3.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");
                } else {
                  articleId = "section";
                }
              }

              const wrapper = document.createElement("div");
              wrapper.classList.add("search-match");

              const link = document.createElement("a");
              link.href = `${page}#${articleId}`;
              link.textContent = readableTitle;
              link.classList.add("search-link");

              const label = document.createElement("strong");
              label.appendChild(link);

              wrapper.appendChild(label);
              wrapper.appendChild(cloned);
              resultsContainer.appendChild(wrapper);
            }
          });
        } catch (err) {
          console.warn(`❌ ${page} fetch error:`, err.message);
        }
      });
    } else {
      resultsContainer.innerHTML = "";
    }
  }

  // 🔠 Underline matched text inside an element
  function highlightMatch(element, query) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const index = node.nodeValue.toLowerCase().indexOf(query);
      if (index !== -1) {
        const span = document.createElement("span");
        const before = node.nodeValue.slice(0, index);
        const match = node.nodeValue.slice(index, index + query.length);
        const after = node.nodeValue.slice(index + query.length);
        span.innerHTML = `${before}<u>${match}</u>${after}`;
        node.parentNode.replaceChild(span, node);
      }
    }
  }
});
