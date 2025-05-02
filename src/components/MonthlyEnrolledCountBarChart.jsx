import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfigs";
import { format, getYear, getMonth } from "date-fns";

const MonthlyEnrolledCountBarChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMonthlyEnrolled = async () => {
      try {
        const enrolledSnapshot = await getDocs(collection(db, "Enrolled"));
        const currentYear = new Date().getFullYear();

        // Initialize counts for all 12 months
        const monthlyCounts = Array.from({ length: 12 }, (_, i) => ({
          month: format(new Date(currentYear, i, 1), "MMMM"),
          count: 0,
        }));

        enrolledSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.DateEnrolled?.toDate?.();
          if (timestamp && getYear(timestamp) === currentYear) {
            const monthIndex = getMonth(timestamp); // 0–11
            monthlyCounts[monthIndex].count += 1;
          }
        });

        setMonthlyData(monthlyCounts);
      } catch (error) {
        console.error("Error fetching monthly enrolled data:", error);
      }
    };

    fetchMonthlyEnrolled();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData} margin={{ top: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" angle={-30} textAnchor="end" interval={0} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8">
          <LabelList dataKey="count" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyEnrolledCountBarChart;
