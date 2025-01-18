import { useState } from "react";
import styles from "./Calendar.module.css";

function Calendar({ value, onChange }) {
  const [currentDate, setCurrentDate] = useState(value || new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayEmpty} />);
    }

    // 添加日期
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isSelected = value && date.toDateString() === value.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`${styles.day} ${isSelected ? styles.selected : ""} ${
            isToday ? styles.today : ""
          }`}
          onClick={() => onChange(date)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className={styles.weekdays}>
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.days}>{renderCalendar()}</div>
    </div>
  );
}

export default Calendar;
