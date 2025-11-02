const admin = require("firebase-admin");
const db = admin.firestore();

async function submitRating(page, value) {
  const docRef = db.collection("ratings").doc(page);
  const doc = await docRef.get();

  let total = 0;
  let count = 0;

  if (doc.exists) {
    const data = doc.data();
    total = data.total || 0;
    count = data.count || 0;
  }

  total += value;
  count += 1;

  await docRef.set({ total, count }, { merge: true });
  return { average: (total / count).toFixed(1), count };
}

module.exports = { submitRating };
