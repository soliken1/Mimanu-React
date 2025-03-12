const calculateTotalScreenTime = (screenTimeArray) => {
  if (!Array.isArray(screenTimeArray) || screenTimeArray.length === 0) return 0;

  return screenTimeArray.reduce(
    (total, entry) => total + (entry.Duration || 0),
    0
  );
};

export default calculateTotalScreenTime;
