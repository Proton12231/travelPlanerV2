import { useState, useRef, useEffect } from "react";
import Input from "../Input";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import styles from "./DateTimePicker.module.css";

function DateTimePicker({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? new Date(value) : null
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedTime) {
      const newDateTime = new Date(date);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      onChange(newDateTime.toISOString());
      setShowPicker(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());
      onChange(newDateTime.toISOString());
      setShowPicker(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <Input
        label={label}
        value={formatDateTime(value)}
        readOnly
        placeholder="请选择日期和时间"
        onClick={() => setShowPicker(true)}
      />
      {showPicker && (
        <div className={styles.pickerContainer}>
          <div className={styles.pickerContent}>
            <Calendar value={selectedDate} onChange={handleDateSelect} />
            <TimePicker value={selectedTime} onChange={handleTimeSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
