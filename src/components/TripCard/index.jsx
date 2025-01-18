import { formatTransportNo } from "../../utils/format";
import Icon from "../Icon";
import styles from "./TripCard.module.css";

function TripCard({ data }) {
  const {
    transportType,
    flightNo,
    airline,
    trainType,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    stopover,
    price,
    hotel,
  } = data;

  const formatTime = (time) => {
    const date = new Date(time);
    return {
      date: date.toLocaleDateString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
      }),
      time: date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const getTransportIcon = () => {
    return <Icon type={transportType} />;
  };

  const departureDateTime = formatTime(departureTime);
  const arrivalDateTime = formatTime(arrivalTime);

  return (
    <div className={styles.card}>
      <div className={styles.mainContent}>
        <div className={styles.cities}>
          <div className={styles.cityInfo}>
            <div className={styles.cityName}>{departureCity}</div>
            <div className={styles.dateTime}>
              <div className={styles.time}>{departureDateTime.time}</div>
              <div className={styles.date}>{departureDateTime.date}</div>
            </div>
          </div>

          <div className={styles.flightInfo}>
            <div className={styles.transport}>
              <span className={styles.icon}>{getTransportIcon()}</span>
              <span className={styles.flightNo}>
                {transportType === "plane" ? (
                  <>
                    <span className={styles.prefix}>{airline}</span>
                    <span>{flightNo}</span>
                  </>
                ) : transportType === "train" ? (
                  <>
                    <span className={styles.prefix}>{trainType}</span>
                    <span>{flightNo}</span>
                  </>
                ) : (
                  <span>{formatTransportNo(transportType, flightNo)}</span>
                )}
              </span>
            </div>
            <div className={styles.duration}>
              <div className={styles.durationLine}>
                <div className={styles.durationDot} />
                <div className={styles.durationDot} />
              </div>
              <span>{getDuration(departureTime, arrivalTime)}</span>
            </div>
          </div>

          <div className={styles.cityInfo}>
            <div className={styles.cityName}>{arrivalCity}</div>
            <div className={styles.dateTime}>
              <div className={styles.time}>{arrivalDateTime.time}</div>
              <div className={styles.date}>{arrivalDateTime.date}</div>
            </div>
          </div>
        </div>

        {stopover && (
          <div className={styles.stopover}>
            <span className={styles.stopoverIcon}>🔄</span>
            经停：{stopover.city} · {Math.floor(stopover.duration / 60)}h
            {stopover.duration % 60 > 0 ? ` ${stopover.duration % 60}m` : ""}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {hotel && (
          <div className={styles.hotel}>
            <Icon type="hotel" />
            {hotel.name}
          </div>
        )}
        <div className={styles.price}>
          <div className={`${styles.priceItem} ${styles.totalPrice}`}>
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
