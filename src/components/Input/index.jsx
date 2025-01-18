import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  ({ label, error, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <input
            ref={ref}
            className={`${styles.input} ${className || ""}`}
            {...props}
          />
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

export default Input;
