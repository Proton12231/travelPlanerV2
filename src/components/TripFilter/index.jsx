import { useState } from "react";
import Input from "../Input";
import DateTimePicker from "../DateTimePicker";
import styles from "./TripFilter.module.css";

function TripFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    city: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className={styles.filter}>
      <Input
        placeholder="搜索城市"
        value={filters.city}
        onChange={(e) => handleChange("city", e.target.value)}
        prefix="🔍"
      />
      <div className={styles.dateRange}>
        <DateTimePicker
          placeholder="起始时间"
          value={filters.startTime}
          onChange={(value) => handleChange("startTime", value)}
        />
        <span className={styles.separator}>-</span>
        <DateTimePicker
          placeholder="结束时间"
          value={filters.endTime}
          onChange={(value) => handleChange("endTime", value)}
        />
      </div>
    </div>
  );
}

export default TripFilter;
