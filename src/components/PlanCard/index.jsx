import { useMemo } from "react";
import styles from "./PlanCard.module.css";

function PlanCard({ data, onClick, onDelete }) {
  const { planName, trips = [], createdAt } = data;

  const stats = useMemo(() => {
    if (!trips.length) {
      return {
        startCity: "-",
        endCity: "-",
        duration: "0小时",
        totalPrice: 0,
      };
    }

    const start = new Date(trips[0].departureTime);
    const end = new Date(trips[trips.length - 1].arrivalTime);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));

    const totalPrice = trips.reduce(
      (sum, trip) => sum + Number(trip.price) + Number(trip.hotel?.price || 0),
      0
    );

    return {
      startCity: trips[0].departureCity,
      endCity: trips[trips.length - 1].arrivalCity,
      duration: `${hours}小时`,
      totalPrice,
    };
  }, [trips]);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(data);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.title}>{planName}</div>
        <button className={styles.deleteButton} onClick={handleDelete}>
          删除
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.route}>
          <div className={styles.city}>
            <div className={styles.cityName}>{stats.startCity}</div>
            <div className={styles.label}>出发地</div>
          </div>
          <div className={styles.divider}>
            <div className={styles.line} />
            <div className={styles.stops}>
              <span className={styles.stopsIcon}>✈️</span>
              <span className={styles.stopsCount}>{trips.length}程</span>
            </div>
          </div>
          <div className={styles.city}>
            <div className={styles.cityName}>{stats.endCity}</div>
            <div className={styles.label}>目的地</div>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>🕒</div>
            <div>
              <div className={styles.infoValue}>{stats.duration}</div>
              <div className={styles.label}>总时长</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>💰</div>
            <div>
              <div className={styles.infoValue}>¥{stats.totalPrice}</div>
              <div className={styles.label}>总价格</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.time}>
          创建时间：{new Date(createdAt).toLocaleString("zh-CN")}
        </div>
        <div className={styles.viewMore}>点击查看详情 →</div>
      </div>

      <div className={styles.decorLeft} />
      <div className={styles.decorRight} />
    </div>
  );
}

export default PlanCard;
