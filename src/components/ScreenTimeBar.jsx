const ScreenTimeBar = ({ screenTimeData }) => {
  if (!screenTimeData || screenTimeData.length === 0) return null;

  // Aggregate durations by screen name
  const screenMap = screenTimeData.reduce((acc, entry) => {
    const screenName = entry.Screen;
    acc[screenName] = (acc[screenName] || 0) + (entry.Duration || 0);
    return acc;
  }, {});

  // Convert object to array and sort by total duration
  const aggregatedScreens = Object.entries(screenMap)
    .map(([screen, totalDuration]) => ({ screen, totalDuration }))
    .sort((a, b) => b.totalDuration - a.totalDuration)
    .slice(0, 3); // Get top 3 screens

  // Calculate total time spent for top 3
  const topTotalTime = aggregatedScreens.reduce(
    (sum, entry) => sum + entry.totalDuration,
    0
  );
  if (topTotalTime === 0) return null; // Avoid division by zero

  // Define colors for screens
  const screenColors = ["#4188ff", "#e23636", "#edb95e"]; // Blue, Red, Yellow

  return (
    <div className="w-full h-auto mt-5">
      <div className="flex flex-row justify-between">
        <label className="text-gray-600">Time Breakdown:</label>
        <div className="flex justify-end gap-5 text-xs text-gray-600">
          {aggregatedScreens.map((screen, index) => (
            <div key={screen.screen} className="flex items-center">
              <div
                className="w-3 rounded-full h-3 mr-1"
                style={{ backgroundColor: screenColors[index] }}
              ></div>
              {screen.screen}:{" "}
              {((screen.totalDuration / topTotalTime) * 100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>

      <div className="flex mt-2 gap-2">
        {aggregatedScreens.map((screen, index) => {
          const widthPercent = (screen.totalDuration / topTotalTime) * 100;
          return (
            <div
              key={screen.screen}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: screenColors[index],
              }}
              className="rounded-xl h-4"
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default ScreenTimeBar;
