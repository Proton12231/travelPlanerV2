import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div
      className={`${styles.toast} ${styles[type]} ${
        visible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.icon}>
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "warning" && "!"}
        {type === "info" && "i"}
      </div>
      <span className={styles.message}>{message}</span>
    </div>,
    document.body
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const contextValue = {
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration),
    show: addToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export { ToastProvider };

// 为了保持兼容性，同时导出一个全局 toast 对象
const toast = {
  show: (...args) => {
    console.warn(
      "Using global toast is deprecated. Please use useToast hook instead."
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onClose = () => {
      document.body.removeChild(container);
    };
    const element = (
      <Toast message={args[0]} type={args[1]} onClose={onClose} />
    );
    createPortal(element, container);
  },
  success: (message) => toast.show(message, "success"),
  error: (message) => toast.show(message, "error"),
  warning: (message) => toast.show(message, "warning"),
  info: (message) => toast.show(message, "info"),
};

export default toast;
