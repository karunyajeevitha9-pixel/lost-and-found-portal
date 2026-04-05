// ============================================================
//  lost.js  —  Report Lost Item  (Firebase Firestore version)
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("lostForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const itemName   = document.getElementById("itemName").value.trim();
  const description= document.getElementById("description").value.trim();
  const category   = document.getElementById("category").value;
  const location   = document.getElementById("location").value.trim();
  const dateLost   = document.getElementById("dateLost").value;
  const contact    = document.getElementById("contact").value.trim();
  const imageFile  = document.getElementById("image").files[0];

  // ── Validation ──────────────────────────────────────────
  const alphabetPattern = /^[A-Za-z ]+$/;
  if (!alphabetPattern.test(itemName)) {
    alert("Item name should contain only alphabets.");
    return;
  }
  if (!alphabetPattern.test(location)) {
    alert("Location should contain only alphabets.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;
  if (!(emailPattern.test(contact) || phonePattern.test(contact))) {
    alert("Enter a valid email or 10-digit phone number.");
    return;
  }

  if (imageFile) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(imageFile.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed.");
      return;
    }
  }

  // ── Read image as base64 (if provided) ──────────────────
  const imageData = imageFile ? await readFileAsBase64(imageFile) : "";

  // ── Save to Firestore ────────────────────────────────────
  const submitBtn = document.querySelector("#lostForm button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    const itemData = {
      name:        itemName,
      description: description,
      category:    category,
      location:    location,
      date:        dateLost,
      contact:     contact,
      image:       imageData,
      type:        "lost",
      createdAt:   serverTimestamp()
    };

    await addDoc(collection(db, "items"), itemData);

    // ── Check for possible match in "found" items ─────────
    const q = query(
      collection(db, "items"),
      where("type",     "==", "found"),
      where("name",     "==", itemName),
      where("location", "==", location)
    );
    const matchSnap = await getDocs(q);
    if (!matchSnap.empty) {
      alert("🎉 Possible match found! Check Browse Items.");
    } else {
      alert("✅ Lost item reported successfully!");
    }

    document.getElementById("lostForm").reset();
  } catch (err) {
    console.error("Firestore error:", err);
    alert("❌ Error saving item. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Report";
  }
});

// ── Helper ───────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function refreshPage() {
  location.reload();
}
window.refreshPage = refreshPage;