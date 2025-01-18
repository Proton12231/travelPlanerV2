import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className={styles.layout}>
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
      </div>
      <div className={styles.content}>
        <Navbar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
