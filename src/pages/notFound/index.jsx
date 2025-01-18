import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./NotFound.module.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.title}>页面不见了</div>
        <div className={styles.description}>
          抱歉，您访问的页面可能已被删除或不存在
        </div>
        <div className={styles.actions}>
          <Button type="primary" onClick={() => navigate("/travelPlanerV2/")}>
            返回首页
          </Button>
          <Button type="secondary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        </div>
      </div>
      <div className={styles.decoration}>
        <div className={styles.cloud1}>☁️</div>
        <div className={styles.cloud2}>☁️</div>
        <div className={styles.plane}>✈️</div>
      </div>
    </div>
  );
}

export default NotFound;
