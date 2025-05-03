import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const BreakdownBarChart = ({ enrolleePerformaceData }) => {
  if (!enrolleePerformaceData) return;
  // Transform the object into an array suitable for Recharts
  const chartData = Object.entries(enrolleePerformaceData).map(
    ([courseTitle, stats]) => ({
      name: courseTitle,
      percentage: parseFloat(stats.averagePercentage.replace("%", "")), // convert "70.00%" => 70
      fill: stats.color || "#8884d8", // fallback if color is undefined
    })
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Bar dataKey="percentage">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="percentage"
            position="top"
            formatter={(val) => `${val}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBarChart;
