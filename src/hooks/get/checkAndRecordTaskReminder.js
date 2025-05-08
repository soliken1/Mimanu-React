import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

export const checkAndRecordTaskReminder = async (userId, taskId, courseId) => {
  const reminderRef = doc(db, "TaskReminders", `${userId}_${taskId}`);

  try {
    const docSnap = await getDoc(reminderRef);
    const now = new Date();

    if (docSnap.exists()) {
      const lastSent = docSnap.data().sentAt?.toDate();

      if (lastSent) {
        const hoursDiff = (now - lastSent) / (1000 * 60 * 60);
        if (hoursDiff < 24) {
          return true; // Reminder already sent within 24 hours
        }
      }
    }

    await setDoc(reminderRef, {
      userId,
      taskId,
      courseId,
      sentAt: serverTimestamp(),
    });

    return false; // Allow sending
  } catch (error) {
    console.error("Error checking/recording task reminder:", error);
    return true; // Fallback to avoid spamming
  }
};
