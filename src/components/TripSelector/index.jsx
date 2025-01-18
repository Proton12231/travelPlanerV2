import { useState } from "react";
import Button from "../Button";
import TripCard from "../TripCard";
import styles from "./TripSelector.module.css";

function TripSelector({ trips, selectedTrips, onSubmit, onCancel }) {
  const [selected, setSelected] = useState(new Set());

  const handleSelect = (trip) => {
    const newSelected = new Set(selected);
    if (newSelected.has(trip.id)) {
      newSelected.delete(trip.id);
    } else {
      newSelected.add(trip.id);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    const selectedTripData = trips.filter((trip) => selected.has(trip.id));
    onSubmit(selectedTripData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={`${styles.tripItem} ${
              selected.has(trip.id) ? styles.selected : ""
            }`}
            onClick={() => handleSelect(trip)}
          >
            <TripCard data={trip} />
          </div>
        ))}
        {trips.length === 0 && <div className={styles.empty}>暂无可选行程</div>}
      </div>
      <div className={styles.footer}>
        <Button type="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={selected.size === 0}
        >
          确定
        </Button>
      </div>
    </div>
  );
}

export default TripSelector;
