import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";

function Select({
  options = [],
  value,
  onChange,
  placeholder = "请选择",
  label,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={selectRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.select} ${isOpen ? styles.open : ""} ${
          error ? styles.error : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.value}>
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className={`${styles.arrow} ${isOpen ? styles.up : ""}`}>▼</div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                option.value === value ? styles.selected : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default Select;
