const formatDate = (seconds) => {
  if (!seconds) return "N/A";

  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default formatDate;
