import { useState } from "react";
import styles from "./TimePicker.module.css";

function TimePicker({ value, onChange }) {
  const [selectedHour, setSelectedHour] = useState(
    value ? value.getHours() : new Date().getHours()
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? value.getMinutes() : null
  );

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(selectedMinute);
    onChange(date);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    const date = new Date();
    date.setHours(selectedHour);
    date.setMinutes(minute);
    onChange(date);
  };

  return (
    <div className={styles.timePicker}>
      <div className={styles.column}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className={`${styles.timeItem} ${
              selectedHour === i ? styles.selected : ""
            }`}
            onClick={() => handleHourChange(i)}
          >
            {String(i).padStart(2, "0")}
          </div>
        ))}
      </div>
      <div className={styles.column}>
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className={`${styles.timeItem} ${
              selectedMinute === i ? styles.selected : ""
            }`}
            onClick={() => handleMinuteChange(i)}
          >
            {String(i).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimePicker;
