import { formatAirline } from "../../constants/airlines";
import { formatFlightNo } from "../../utils/format";
import styles from "./TripCard.module.css";

function TripCard({ data, onEdit, onDelete }) {
  const {
    transportType,
    flightNo,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    stopover,
    price,
    hotel,
  } = data;

  const formatTime = (time) => {
    return new Date(time).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.transport}>
          {transportType === "plane" && (
            <>
              <span className={styles.icon}>✈️</span>
              <span className={styles.flightNo}>
                {formatFlightNo(flightNo)}
              </span>
            </>
          )}
          {transportType === "train" && (
            <>
              <span className={styles.icon}>🚂</span>
              <span className={styles.flightNo}>{flightNo}</span>
            </>
          )}
          {transportType === "bus" && (
            <>
              <span className={styles.icon}>🚌</span>
              <span className={styles.flightNo}>{flightNo}</span>
            </>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={onEdit}>
            编辑
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={onDelete}
          >
            删除
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.route}>
          <div className={styles.city}>
            <div className={styles.cityName}>{departureCity}</div>
            <div className={styles.time}>{formatTime(departureTime)}</div>
          </div>
          <div className={styles.divider}>
            <div className={styles.line} />
            {stopover && (
              <div className={styles.stopover}>
                经停：{stopover.city}
                <br />
                {stopover.duration}分钟
              </div>
            )}
            <div className={styles.duration}>
              {getDuration(departureTime, arrivalTime)}
            </div>
          </div>
          <div className={styles.city}>
            <div className={styles.cityName}>{arrivalCity}</div>
            <div className={styles.time}>{formatTime(arrivalTime)}</div>
          </div>
        </div>

        {hotel && (
          <div className={styles.hotel}>
            <span className={styles.icon}>🏨</span>
            <span className={styles.hotelName}>{hotel.name}</span>
            <span className={styles.hotelPrice}>¥{hotel.price}</span>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.label}>票价</span>
            <span className={styles.amount}>¥{price}</span>
          </div>
          <div className={styles.total}>
            <span className={styles.label}>总价</span>
            <span className={styles.amount}>
              ¥{price + (hotel?.price || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
