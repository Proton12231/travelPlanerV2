import { useState, useMemo } from "react";
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

  // 获取所有行程
  const allTrips = useMemo(() => {
    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    return plans.flatMap((plan) =>
      plan.trips?.map((trip) => ({
        ...trip,
        planId: plan.id,
        planName: plan.planName,
      }))
    );
  }, []);

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
    // 创建新的行程方案
    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    if (isEdit) {
      // 更新已有行程
      const updatedPlans = plans?.map((plan) => {
        if (plan?.id === editingTrip?.planId) {
          return {
            ...plan,
            trips: plan?.trips?.map((trip) =>
              trip === editingTrip ? tripData : trip
            ),
          };
        }
        return plan;
      });
      localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
    } else {
      // 创建新行程
      const newPlan = {
        id: Date.now(),
        planName: `${tripData.departureCity} → ${tripData.arrivalCity}`,
        trips: [tripData],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("travelPlans", JSON.stringify([...plans, newPlan]));
    }

    setShowForm(false);
    setEditingTrip(null);
    window.location.reload(); // 刷新页面以更新数据
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = (trip) => {
    if (!window.confirm("确定要删除这个行程吗？")) return;

    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const updatedPlans = plans
      ?.map((plan) => {
        if (plan.id === trip.planId) {
          return {
            ...plan,
            trips: plan.trips.filter((t) => t !== trip),
          };
        }
        return plan;
      })
      .filter((plan) => plan.trips?.length > 0); // 如果方案没有行程则删除

    localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
    window.location.reload();
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
          key={`${trip.planId}-${index}`}
          className={styles.tripCard}
          onClick={() => handleEdit(trip)}
        >
          <TripCard data={trip} />
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
