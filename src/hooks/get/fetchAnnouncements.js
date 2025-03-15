import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfigs";

const fetchAnnouncements = async (courseId) => {
  try {
    const announcementRef = query(
      collection(db, "Course", courseId, "Announcement"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(announcementRef);

    const announcements = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return announcements;
  } catch (err) {
    console.error("Error fetching announcements:", err);
    throw err;
  }
};

export default fetchAnnouncements;
