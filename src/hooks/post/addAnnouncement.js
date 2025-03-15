import { db } from "../../config/firebaseConfigs"; // Import Firestore config
import { collection, addDoc } from "firebase/firestore";

/**
 * Adds an announcement to a specific course in Firestore.
 * @param {string} courseId - The ID of the course.
 * @param {string} announcementTitle - The title of the announcement.
 * @param {string} announcementDetails - The details/content of the announcement.
 * @returns {Promise<void>}
 */
const addAnnouncement = async (
  courseId,
  announcementTitle,
  announcementDetails
) => {
  try {
    const announcementRef = collection(db, "Course", courseId, "Announcement");

    await addDoc(announcementRef, {
      AnnouncementTitle: announcementTitle,
      AnnouncementDetails: announcementDetails,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
};

export default addAnnouncement;
