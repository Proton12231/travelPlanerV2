import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../Button";
import styles from "./Modal.module.css";

function Modal({
  visible,
  title,
  children,
  footer,
  width = 520,
  onClose,
  closeOnMaskClick = true,
  showClose = true,
  centered = true,
  confirmBeforeClose = false,
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

  const handleClose = () => {
    if (confirmBeforeClose) {
      if (window.confirm("确定要关闭吗？未保存的内容将会丢失")) {
        onClose?.();
      }
    } else {
      onClose?.();
    }
  };

  const handleMaskClick = (e) => {
    if (e.target === e.currentTarget && closeOnMaskClick) {
      handleClose();
    }
  };

  if (!visible) return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${centered ? styles.centered : ""}`}
      onClick={handleMaskClick}
    >
      <div
        className={styles.modal}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {showClose && (
            <button className={styles.closeButton} onClick={handleClose}>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
        {footer !== null && (
          <div className={styles.footer}>
            {footer || (
              <>
                <Button type="secondary" onClick={handleClose}>
                  取消
                </Button>
                <Button type="primary" onClick={handleClose}>
                  确定
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
