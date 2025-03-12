import {
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../config/firebaseConfigs";

let startTime = null;
let currentScreen = null;
let trackingInitialized = false;
let isSaving = false; // Prevent multiple saves

const trackUserScreenTime = (enrolledId, screenName) => {
  if (!enrolledId || !screenName) return;

  if (currentScreen !== screenName) {
    startTime = Date.now();
    currentScreen = screenName;
  }

  if (!trackingInitialized) {
    trackingInitialized = true;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await saveScreenTime(enrolledId);
      } else {
        startTime = Date.now();
      }
    };

    const handleBeforeUnload = async (event) => {
      event.preventDefault(); // Ensures the event is handled correctly
      await saveScreenTime(enrolledId);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
  }
};

const saveScreenTime = async (enrolledId) => {
  if (!startTime || !currentScreen || isSaving) return;

  isSaving = true; // Prevent multiple saves

  const endTime = Date.now();
  const duration = Math.floor((endTime - startTime) / 1000);

  const enrolledRef = collection(db, "Enrolled", enrolledId, "ScreenTime");

  await addDoc(enrolledRef, {
    Screen: currentScreen,
    Duration: duration,
    Timestamp: new Date(),
  });

  startTime = null;
  isSaving = false; // Reset after saving
};

export { trackUserScreenTime };
