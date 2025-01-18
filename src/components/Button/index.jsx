import styles from "./Button.module.css";

function Button({
  children,
  type = "primary",
  size = "middle",
  block,
  loading,
  icon,
  disabled,
  className,
  onClick,
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[type]} ${styles[size]} ${
        block ? styles.block : ""
      } ${loading ? styles.loading : ""} ${disabled ? styles.disabled : ""} ${
        className || ""
      }`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles.spinner}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
          </svg>
        </span>
      )}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
}

export default Button;
