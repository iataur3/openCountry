const admin = require("firebase-admin");
const db = admin.firestore();

async function updateViewCount(page) {
  const docRef = db.collection("viewCounts").doc(page);
  const doc = await docRef.get();

  let currentViews = 0;
  if (doc.exists) {
    currentViews = doc.data().views || 0;
  }

  await docRef.set({ views: currentViews + 1 }, { merge: true });
  return currentViews + 1;
}

module.exports = { updateViewCount };
