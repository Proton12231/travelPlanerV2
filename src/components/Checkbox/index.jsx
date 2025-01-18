import { forwardRef } from "react";
import styles from "./Checkbox.module.css";

const Checkbox = forwardRef(
  ({ label, error, className, checked, onChange, ...props }, ref) => {
    return (
      <div className={styles.container}>
        <label className={styles.wrapper}>
          <input
            type="checkbox"
            ref={ref}
            className={`${styles.input} ${className || ""}`}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          <span className={styles.checkbox}>
            <svg
              className={styles.checkmark}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20 6L9 17L4 12"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {label && <span className={styles.label}>{label}</span>}
        </label>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

export default Checkbox;
