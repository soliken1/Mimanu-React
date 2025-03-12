import { Timestamp } from "firebase/firestore";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default formatTimestamp;
