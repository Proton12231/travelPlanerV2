import { useState, useRef, useEffect } from "react";
import styles from "./DateTimePicker.module.css";

function DateTimePicker({
  value,
  onChange,
  label,
  error,
  placeholder = "选择日期和时间",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":");
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
    onChange(newDate.toISOString());
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={styles.container} ref={pickerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.picker} ${isOpen ? styles.open : ""} ${
          error ? styles.error : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.value}>
          {value ? formatDateTime(value) : placeholder}
        </div>
        <div className={`${styles.arrow} ${isOpen ? styles.up : ""}`}>▼</div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="date"
            className={styles.dateInput}
            value={date.toISOString().split("T")[0]}
            onChange={handleDateChange}
          />
          <input
            type="time"
            className={styles.timeInput}
            value={`${String(date.getHours()).padStart(2, "0")}:${String(
              date.getMinutes()
            ).padStart(2, "0")}`}
            onChange={handleTimeChange}
          />
        </div>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default DateTimePicker;
