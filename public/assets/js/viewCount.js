// public/assets/js/viewCount.js
document.addEventListener("DOMContentLoaded", async () => {
  const viewCounter = document.getElementById("viewCount");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  try {
    const res = await fetch("/api/updateView", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: currentPage }),
    });

    const data = await res.json();
    viewCounter.textContent = data.views || "০";
  } catch (err) {
    console.error("❌ ভিউ কাউন্ট আপডেট করতে সমস্যা:", err.message);
    viewCounter.textContent = "তথ্য পাওয়া যায়নি";
  }
});
