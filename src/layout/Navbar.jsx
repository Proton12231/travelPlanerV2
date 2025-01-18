import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.glass}>
        <div className={styles.content}>
          <h1 className={styles.title}>春运助手</h1>
          <div className={styles.links}>
            <Link
              to="/"
              className={`${styles.link} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              方案列表
            </Link>
            <Link
              to="/itineraries"
              className={`${styles.link} ${
                location.pathname === "/itineraries" ? styles.active : ""
              }`}
            >
              行程管理
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
