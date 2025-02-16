import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };

  const renderCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const totalCells = startDay + daysInMonth;
    const cells = [];
    let dayCounter = 1;

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        cells.push(<td key={`empty-${i}`} className="h-8"></td>);
      } else {
        const currentDay = new Date(year, month, dayCounter);
        const isToday = today.toDateString() === currentDay.toDateString();

        cells.push(
          <td
            key={`day-${dayCounter}`}
            className={`h-8 text-center text-xs ${
              isToday
                ? "bg-[#152852] text-white font-bold rounded-full"
                : "text-gray-700"
            }`}
          >
            {dayCounter}
          </td>
        );
        dayCounter++;

        if ((i + 1) % 7 === 0 && i < totalCells - 1) {
          cells.push(<tr key={`row-${i}`}></tr>);
        }
      }
    }

    return cells;
  };

  return (
    <div className="shadow-xy rounded-lg bg-white p-5 text-center">
      <div className="mb-4 flex flex-row items-center justify-evenly">
        <button onClick={handlePreviousMonth} className="rounded-md">
          <svg
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.18311 1.175L2.35811 5L6.18311 8.825L4.99977 10L-0.000227928 5L4.99977 0L6.18311 1.175Z"
              fill="#B5BEC6"
            />
          </svg>
        </button>
        <label className="text-xl text-[#152852]">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </label>
        <button onClick={handleNextMonth} className="rounded-md">
          <svg
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 8.825L3.825 5L0 1.175L1.18333 0L6.18333 5L1.18333 10L0 8.825Z"
              fill="#B5BEC6"
            />
          </svg>
        </button>
      </div>

      <table className="mx-auto w-full table-auto border-collapse text-sm">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="text-xs text-[#152852]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>{renderCalendarCells()}</tr>
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
