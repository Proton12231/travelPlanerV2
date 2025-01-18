import styles from "./Empty.module.css";

const ICONS = {
  default: "📦",
  plan: "✈️",
  trip: "🗺️",
  search: "🔍",
  data: "📊",
  error: "❌",
};

function Empty({
  icon = "default",
  customIcon,
  title = "暂无数据",
  description,
  children,
  className,
}) {
  return (
    <div className={`${styles.empty} ${className || ""}`}>
      <div className={styles.icon}>
        {customIcon || ICONS[icon] || ICONS.default}
      </div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}

export default Empty;
