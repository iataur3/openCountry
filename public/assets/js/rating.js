star.addEventListener("click", async () => {
  localStorage.setItem(`rating-${window.location.pathname}`, i);
  updateStars(i);
  result.textContent = `আপনি ${i} স্টার দিয়েছেন।`;

  try {
    const res = await fetch("/api/ratePage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: currentPage, rating: i }),
    });
    const data = await res.json();
    result.textContent += ` (গড় রেটিং: ${data.average} / মোট ভোট: ${data.count})`;
  } catch (err) {
    console.error("❌ রেটিং পাঠাতে সমস্যা:", err.message);
  }
});
