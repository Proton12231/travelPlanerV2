import Icon from "../Icon";
import { formatTransportNo } from "../../utils/format";
import styles from "./ExportTemplate.module.css";

function ExportTemplate({ data }) {
  const { planName, trips, createdAt } = data;

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

  const getTotalStats = () => {
    if (!trips?.length) return null;

    const start = new Date(trips[0].departureTime);
    const end = new Date(trips[trips.length - 1].arrivalTime);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));

    const totalPrice = trips.reduce(
      (sum, trip) => sum + Number(trip.price) + Number(trip.hotel?.price || 0),
      0
    );

    return {
      duration: `${hours}h`,
      totalPrice,
    };
  };

  const stats = getTotalStats();

  return (
    <div className={styles.template}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Icon type="plane" />
          <span>春运助手</span>
        </div>
        <div className={styles.title}>{planName}</div>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <Icon type="clock" />
            <span>{stats.duration}</span>
          </div>
          <div className={styles.summaryItem}>
            <Icon type="money" />
            <span>¥{stats.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        {trips.map((trip, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineLine}>
              <div className={styles.dot} />
              {index < trips.length - 1 && <div className={styles.line} />}
            </div>
            <div className={styles.tripCard}>
              <div className={styles.tripHeader}>
                <div className={styles.transport}>
                  <Icon type={trip.transportType} />
                  <span>
                    {trip.transportType === "plane" ? (
                      <>
                        <span className={styles.prefix}>{trip.airline}</span>
                        <span>{trip.flightNo}</span>
                      </>
                    ) : trip.transportType === "train" ? (
                      <>
                        <span className={styles.prefix}>{trip.trainType}</span>
                        <span>{trip.flightNo}</span>
                      </>
                    ) : (
                      <span>
                        {formatTransportNo(trip.transportType, trip.flightNo)}
                      </span>
                    )}
                  </span>
                </div>
                <div className={styles.price}>¥{trip.price}</div>
              </div>
              <div className={styles.cities}>
                <div className={styles.cityInfo}>
                  <div className={styles.cityName}>{trip.departureCity}</div>
                  <div className={styles.time}>
                    {formatTime(trip.departureTime).time}
                  </div>
                  <div className={styles.date}>
                    {formatTime(trip.departureTime).date}
                  </div>
                </div>
                <div className={styles.duration}>
                  <div className={styles.durationLine} />
                  <span>
                    {getDuration(trip.departureTime, trip.arrivalTime)}
                  </span>
                </div>
                <div className={styles.cityInfo}>
                  <div className={styles.cityName}>{trip.arrivalCity}</div>
                  <div className={styles.time}>
                    {formatTime(trip.arrivalTime).time}
                  </div>
                  <div className={styles.date}>
                    {formatTime(trip.arrivalTime).date}
                  </div>
                </div>
              </div>
              {trip.stopover && (
                <div className={styles.stopover}>
                  <Icon type="transfer" />
                  <span>
                    经停{trip.stopover.city} ·{" "}
                    {Math.floor(trip.stopover.duration / 60)}h
                    {trip.stopover.duration % 60 > 0
                      ? ` ${trip.stopover.duration % 60}m`
                      : ""}
                  </span>
                </div>
              )}
              {trip.hotel && (
                <div className={styles.hotel}>
                  <Icon type="hotel" />
                  <span>{trip.hotel.name}</span>
                  <span className={styles.hotelPrice}>¥{trip.hotel.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.qrCode}>
          <div className={styles.qrPlaceholder} />
          <span>扫码规划行程</span>
        </div>
        <div className={styles.copyright}>
          <div className={styles.poweredBy}>
            Generated by TravelPlaner
            <br />
            让回家的路更简单
          </div>
          <div className={styles.time}>
            创建于 {new Date(createdAt).toLocaleString("zh-CN")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportTemplate;
