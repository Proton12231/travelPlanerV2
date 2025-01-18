import { useState, useMemo, useEffect } from "react";
import Button from "../../components/Button";
import TripCard from "../../components/TripCard";
import TripFilter from "../../components/TripFilter";
import TripForm from "../planCreate/TripForm";
import Modal from "../../components/Modal";
import Icon from "../../components/Icon";
import styles from "./ItineraryList.module.css";

function ItineraryList() {
  const [filters, setFilters] = useState({
    city: "",
    startTime: "",
    endTime: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [allTrips, setAllTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trips") || "[]");
    } catch (error) {
      console.error("Error loading initial trips:", error);
      return [];
    }
  });

  // 筛选行程
  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      // 城市筛选
      if (
        filters.city &&
        !trip.departureCity.includes(filters.city) &&
        !trip.arrivalCity.includes(filters.city) &&
        !trip.stopover?.city?.includes(filters.city)
      ) {
        return false;
      }

      // 时间筛选
      const departureTime = new Date(trip?.departureTime);
      const arrivalTime = new Date(trip?.arrivalTime);

      if (filters.startTime && departureTime < new Date(filters.startTime)) {
        return false;
      }

      if (filters.endTime && arrivalTime > new Date(filters.endTime)) {
        return false;
      }

      return true;
    });
  }, [allTrips, filters]);

  const handleSubmit = (tripData, isEdit = false) => {
    try {
      const trips = JSON.parse(localStorage.getItem("trips") || "[]");
      if (isEdit) {
        // 更新现有行程
        const updatedTrips = trips.map((trip) =>
          trip.id === editingTrip.id ? { ...tripData, id: trip.id } : trip
        );
        localStorage.setItem("trips", JSON.stringify(updatedTrips));
      } else {
        // 添加新行程
        const newTrip = {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          ...tripData,
        };
        localStorage.setItem("trips", JSON.stringify([...trips, newTrip]));
      }
    } catch (error) {
      console.error("Error handling trip data:", error);
      // 如果数据损坏，重置数据
      localStorage.setItem("trips", "[]");
    }

    setShowForm(false);
    setEditingTrip(null);
    // 使用软刷新替代页面刷新
    window.dispatchEvent(new Event("storage"));
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = (trip) => {
    if (!window.confirm("确定要删除这个行程吗？")) return;

    try {
      const trips = JSON.parse(localStorage.getItem("trips") || "[]");
      const updatedTrips = trips.filter((t) => t.id !== trip.id);
      localStorage.setItem("trips", JSON.stringify(updatedTrips));
      // 同时从所有方案中移除该行程
      try {
        const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
        const updatedPlans = plans.map((plan) => ({
          ...plan,
          trips: plan.trips?.filter((t) => t.id !== trip.id) || [],
        }));
        localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
      } catch (error) {
        console.error("Error updating plans:", error);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      localStorage.setItem("trips", "[]");
    }
    window.dispatchEvent(new Event("storage"));
  };

  const handleEditPlan = (planId) => {
    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setEditingPlan(plan);
      setShowPlanForm(true);
    }
  };

  const handlePlanSubmit = (planData) => {
    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const updatedPlans = plans?.map((p) =>
      p.id === planData.id ? planData : p
    );
    localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
    setShowPlanForm(false);
    setEditingPlan(null);
    window.location.reload();
  };

  // 监听 storage 事件来更新数据
  useEffect(() => {
    const handleStorage = () => {
      try {
        const trips = JSON.parse(localStorage.getItem("trips") || "[]");
        setAllTrips(trips);
      } catch (error) {
        console.error("Error loading trips:", error);
        setAllTrips([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>行程管理</h1>
          <span className={styles.count}>{filteredTrips.length} 个行程</span>
        </div>
        <Button type="primary" onClick={() => setShowForm(true)}>
          添加行程
        </Button>
      </div>

      <TripFilter onFilter={setFilters} />

      {filteredTrips?.map((trip, index) => (
        <div
          key={`${trip.id}-${index}`}
          className={styles.tripCard}
          onClick={() => handleEdit(trip)}
        >
          <TripCard
            data={trip}
            onEdit={() => handleEdit(trip)}
            onDelete={() => handleDelete(trip)}
          />
        </div>
      ))}
      {filteredTrips.length === 0 && (
        <div className={styles.empty}>暂无符合条件的行程</div>
      )}

      <Modal
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTrip(null);
        }}
        title={editingTrip ? "编辑行程" : "添加行程"}
        footer={null}
      >
        <TripForm
          initialData={editingTrip}
          onSubmit={(data) => handleSubmit(data, !!editingTrip)}
          onCancel={() => {
            setShowForm(false);
            setEditingTrip(null);
          }}
        />
      </Modal>

      <Modal
        visible={showPlanForm}
        onClose={() => {
          setShowPlanForm(false);
          setEditingPlan(null);
        }}
        title="编辑方案"
      >
        <TripForm
          initialData={editingPlan}
          onSubmit={handlePlanSubmit}
          onCancel={() => {
            setShowPlanForm(false);
            setEditingPlan(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default ItineraryList;
