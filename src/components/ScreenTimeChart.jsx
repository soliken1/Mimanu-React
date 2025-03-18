import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import fetchTopScreenTimeActions from "../hooks/get/fetchTopScreenTimeActions";
import fetchTrainorTopScreenTime from "../hooks/get/trainor/fetchTrainorTopScreenTime";

/**
 * Formats duration (seconds) into `hh:mm` or `2hrs 5mins`
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

const ScreenTimeChart = ({ timeRange, role }) => {
  const [screenTimeData, setScreenTimeData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (role === "Trainor") {
        const data = await fetchTrainorTopScreenTime(timeRange);
        console.log(data);
        setScreenTimeData(data);
      } else {
        const data = await fetchTopScreenTimeActions(timeRange);
        setScreenTimeData(data);
      }
    };
    fetchData();
  }, [timeRange]); // Re-fetch when time range changes

  if (screenTimeData.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No screen time data available.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={screenTimeData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="time" stroke="#8884d8" />
        <YAxis tickFormatter={formatDuration} />{" "}
        {/* ✅ Converts Y-Axis to hh:mm format */}
        <Tooltip formatter={(value) => formatDuration(value)} />
        <Legend />
        {Object.keys(screenTimeData[0])
          .filter((key) => key !== "time")
          .map((screen, index) => (
            <Bar
              key={screen}
              dataKey={screen}
              stackId="1"
              stroke={
                ["#4188ff", "#e23636", "#edb95e", "#4caf50", "#ff9800"][
                  index % 5
                ]
              }
              fill={
                ["#4188ff", "#e23636", "#edb95e", "#4caf50", "#ff9800"][
                  index % 5
                ]
              }
            />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScreenTimeChart;
