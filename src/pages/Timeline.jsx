import React from "react";
import "../styles/Timeline.css";

const Timeline = () => {
  const years = [2023, 2024, 2025];
  const months = [
    "January","February","March","April","May","June","July",
    "August","September","October","November","December"
  ];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // helper: get number of days in a month
  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // helper: get first day of the month (0=Sunday → shift to Mon=0)
  const getFirstDayOfMonth = (year, monthIndex) => {
    let d = new Date(year, monthIndex, 1).getDay(); 
    return d === 0 ? 6 : d - 1; // adjust so Mon=0, Sun=6
  };

  return (
    <div className="timeline">
      {years.map((y) =>
        months.map((m, j) => {
          // filter out based on your conditions
          if (!(y === 2023 && j < 9) && !(y === 2024 && j < 5)) {
            const daysInMonth = getDaysInMonth(y, j);
            const firstDay = getFirstDayOfMonth(y, j);

            // build weeks
            const weeks = [];
            let day = 1 - firstDay; // so first row aligns correctly
            while (day <= daysInMonth) {
              let week = [];
              for (let i = 0; i < 7; i++) {
                if (day < 1 || day > daysInMonth) {
                  week.push(""); // empty cell
                } else {
                  week.push(day);
                }
                day++;
              }
              weeks.push(week);
            }

            return (
              <div key={`${m}-${y}`} id={`month-${m}-${y}`} className="month">
                <table className="table">
                  <thead>
                    <tr>
                      <th colSpan={7} className="month-header">
                        {m}, {y}
                      </th>
                    </tr>
                    <tr>
                      {days.map((d) => (
                        <th key={d}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((week, wi) => (
                      <tr key={wi}>
                        {week.map((d, di) => (
                          <td key={di} className={d ? "day-cell" : "empty"} id={`${d}-${j}-${y}`} style={{background:`url(/images/us/image${d}.jpg)`}}>
                            <dialog>{d}</dialog>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })
      )}
    </div>
  );
};

export default Timeline;
