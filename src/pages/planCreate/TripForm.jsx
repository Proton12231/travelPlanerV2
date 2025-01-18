import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import DateTimePicker from "../../components/DateTimePicker";
import Checkbox from "../../components/Checkbox";
import { AIRLINES } from "../../constants/airlines";
import { TRAIN_TYPES } from "../../constants/trains";
import { useToast } from "../../components/Toast";
import styles from "./TripForm.module.css";

const TRANSPORT_TYPES = [
  { value: "plane", label: "飞机" },
  { value: "train", label: "火车" },
  { value: "bus", label: "汽车" },
];

function TripForm({ initialData, onSubmit, onCancel }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    transportType: "plane",
    airline: "",
    trainType: "G",
    flightNo: "",
    departureCity: "",
    arrivalCity: "",
    departureTime: "",
    arrivalTime: "",
    hasStopover: false,
    stopover: null,
    price: "",
    needHotel: false,
    hotel: null,
    ...initialData,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // 表单验证
    if (!formData.departureCity) {
      toast.error("请输入出发城市");
      return;
    }
    if (!formData.arrivalCity) {
      toast.error("请输入到达城市");
      return;
    }
    if (!formData.departureTime) {
      toast.error("请选择出发时间");
      return;
    }
    if (!formData.arrivalTime) {
      toast.error("请选择到达时间");
      return;
    }
    if (!formData.price) {
      toast.error("请输入票价");
      return;
    }

    // 验证时间
    const start = new Date(formData.departureTime);
    const end = new Date(formData.arrivalTime);
    if (end <= start) {
      toast.error("到达时间必须晚于出发时间");
      return;
    }

    // 提交数据
    onSubmit({
      ...formData,
      price: Number(formData.price),
      hotel: formData.needHotel
        ? {
            ...formData.hotel,
            price: Number(formData.hotel?.price || 0),
          }
        : null,
    });
  };

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <Select
          label="交通方式"
          options={TRANSPORT_TYPES}
          value={formData.transportType}
          onChange={(value) => {
            handleChange("transportType", value);
            // 重置相关字段
            if (value === "train") {
              handleChange("trainType", "");
              handleChange("flightNo", "");
            } else if (value === "plane") {
              handleChange("airline", "");
              handleChange("flightNo", "");
            } else if (value === "bus") {
              handleChange("busNo", "");
            }
          }}
        />

        {formData.transportType === "plane" && (
          <Select
            label="航空公司"
            options={AIRLINES.map((airline) => ({
              value: airline.code,
              label: airline.shortName,
            }))}
            value={formData.airline}
            onChange={(value) => handleChange("airline", value)}
          />
        )}

        {formData.transportType === "train" && (
          <Select
            label="火车类型"
            options={TRAIN_TYPES.map((train) => ({
              value: train.code,
              label: `${train.shortName} (${train.code})`,
            }))}
            value={formData.trainType}
            onChange={(value) => handleChange("trainType", value)}
          />
        )}

        <Input
          label={
            formData.transportType === "plane"
              ? "航班号"
              : formData.transportType === "train"
              ? "车次号"
              : "汽车票号"
          }
          value={formData.flightNo}
          onChange={(e) => handleChange("flightNo", e.target.value)}
          prefix={
            formData.transportType === "plane"
              ? formData.airline
              : formData.trainType
          }
          placeholder={
            formData.transportType === "train"
              ? "请输入车次号"
              : formData.transportType === "plane"
              ? "请输入航班号"
              : "请输入汽车票号"
          }
        />
      </div>

      <div className={styles.row}>
        <Input
          label="出发城市"
          value={formData.departureCity}
          onChange={(e) => handleChange("departureCity", e.target.value)}
        />
        <Input
          label="到达城市"
          value={formData.arrivalCity}
          onChange={(e) => handleChange("arrivalCity", e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <DateTimePicker
          label="出发时间"
          value={formData.departureTime}
          onChange={(value) => handleChange("departureTime", value)}
        />
        <DateTimePicker
          label="到达时间"
          value={formData.arrivalTime}
          onChange={(value) => handleChange("arrivalTime", value)}
        />
      </div>

      <div className={styles.row}>
        <Checkbox
          label="是否经停"
          checked={formData.hasStopover}
          onChange={(e) => handleChange("hasStopover", e.target.checked)}
        />
      </div>

      {formData.hasStopover && (
        <div className={styles.row}>
          <Input
            label="经停城市"
            value={formData.stopover?.city || ""}
            onChange={(e) =>
              handleChange("stopover", {
                ...formData.stopover,
                city: e.target.value,
              })
            }
          />
          <Input
            label="经停时长（分钟）"
            type="number"
            value={formData.stopover?.duration || ""}
            onChange={(e) =>
              handleChange("stopover", {
                ...formData.stopover,
                duration: e.target.value,
              })
            }
          />
        </div>
      )}

      <div className={styles.row}>
        <Input
          label="票价"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          prefix="¥"
        />
      </div>

      <div className={styles.row}>
        <Checkbox
          label="需要住宿"
          checked={formData.needHotel}
          onChange={(e) => handleChange("needHotel", e.target.checked)}
        />
      </div>

      {formData.needHotel && (
        <div className={styles.row}>
          <Input
            label="酒店名称"
            value={formData.hotel?.name || ""}
            onChange={(e) =>
              handleChange("hotel", {
                ...formData.hotel,
                name: e.target.value,
              })
            }
          />
          <Input
            label="住宿费用"
            type="number"
            value={formData.hotel?.price || ""}
            onChange={(e) =>
              handleChange("hotel", {
                ...formData.hotel,
                price: e.target.value,
              })
            }
            prefix="¥"
          />
        </div>
      )}

      <div className={styles.footer}>
        <Button type="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
}

export default TripForm;
