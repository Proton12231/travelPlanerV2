import { useEffect } from "react";
import Button from "../Button";
import styles from "./Confirm.module.css";

function Confirm({
  title = "确认",
  content,
  onConfirm,
  onCancel,
  confirmText = "确定",
  cancelText = "取消",
  confirmType = "primary",
  visible,
}) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>{title}</div>
        <div className={styles.content}>{content}</div>
        <div className={styles.footer}>
          <Button type="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type={confirmType} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
