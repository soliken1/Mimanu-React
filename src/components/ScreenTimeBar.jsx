const ScreenTimeBar = ({ screenTimeData }) => {
  if (!screenTimeData || screenTimeData.length === 0) return null;

  // Aggregate durations by screen name
  const screenMap = screenTimeData.reduce((acc, entry) => {
    const screenName = entry.Screen;
    acc[screenName] = (acc[screenName] || 0) + (entry.Duration || 0);
    return acc;
  }, {});

  // Convert object to array and sort by total duration
  const sortedScreens = Object.entries(screenMap)
    .map(([screen, totalDuration]) => ({ screen, totalDuration }))
    .sort((a, b) => b.totalDuration - a.totalDuration);

  // Extract top 3 screens
  const topScreens = sortedScreens.slice(0, 3);

  // Sum up the durations of "Others"
  const otherScreens = sortedScreens.slice(3);
  const othersTotalDuration = otherScreens.reduce(
    (sum, entry) => sum + entry.totalDuration,
    0
  );

  // Combine the top 3 and "Others" if there are other screens
  const finalScreens = [...topScreens];
  if (othersTotalDuration > 0) {
    finalScreens.push({ screen: "Others", totalDuration: othersTotalDuration });
  }

  // Calculate total time spent
  const totalTimeSpent = finalScreens.reduce(
    (sum, entry) => sum + entry.totalDuration,
    0
  );
  if (totalTimeSpent === 0)
    return (
      <p className="text-center text-gray-600">
        No screen time data available.
      </p>
    );

  // Define colors for screens (adding gray for "Others")
  const screenColors = ["#4188ff", "#e23636", "#edb95e", "#a0aec0"]; // Blue, Red, Yellow, Gray

  return (
    <div className="w-full h-auto mt-5">
      <div className="flex flex-row justify-between">
        <label className="text-gray-600">Time Breakdown:</label>
        <div className="flex justify-end gap-5 text-xs text-gray-600">
          {finalScreens.map((screen, index) => (
            <div key={screen.screen} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: screenColors[index] || "#a0aec0" }} // Default to gray
              ></div>
              {screen.screen}:{" "}
              {((screen.totalDuration / totalTimeSpent) * 100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>

      <div className="flex mt-2">
        {finalScreens.map((screen, index) => {
          const widthPercent = (screen.totalDuration / totalTimeSpent) * 100;
          return (
            <div
              key={screen.screen}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: screenColors[index] || "#a0aec0", // Default to gray
              }}
              className="h-4 duration-300"
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default ScreenTimeBar;
