import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import TripCard from "../../components/TripCard";
import TripForm from "./TripForm";
import Empty from "../../components/Empty";
import { useToast } from "../../components/Toast";
import styles from "./PlanCreate.module.css";
import TripSelector from "../../components/TripSelector";

function PlanCreate({ onSubmit, onCancel, initialValues }) {
  const toast = useToast();
  const [planName, setPlanName] = useState(initialValues?.planName || "");
  const [trips, setTrips] = useState(initialValues?.trips || []);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);

  // 获取所有可选的行程
  const allTrips = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("trips") || "[]");
    } catch (error) {
      console.error("Error loading trips:", error);
      return [];
    }
  }, []);

  // 计算统计信息
  const stats = useMemo(() => {
    if (!trips.length) {
      return {
        duration: "0小时",
        totalPrice: 0,
        cities: [],
      };
    }

    const start = new Date(trips[0].departureTime);
    const end = new Date(trips[trips.length - 1].arrivalTime);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));

    const totalPrice = trips.reduce(
      (sum, trip) => sum + Number(trip.price) + Number(trip.hotel?.price || 0),
      0
    );

    const cities = Array.from(
      new Set(
        trips.flatMap((trip) => [
          trip.departureCity,
          ...(trip.stopover ? [trip.stopover.city] : []),
          trip.arrivalCity,
        ])
      )
    );

    return {
      duration: `${hours}小时`,
      totalPrice,
      cities,
    };
  }, [trips]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(trips);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTrips(items);
  };

  const handleAddTrip = (tripData) => {
    // 生成新的行程 ID
    const newTripData = {
      ...tripData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    if (editingTrip !== null) {
      setTrips((prev) =>
        prev.map((trip, index) => (index === editingTrip ? newTripData : trip))
      );
      setEditingTrip(null);
    } else {
      setTrips((prev) => [...prev, newTripData]);
    }

    // 同时保存到行程表中
    try {
      const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
      localStorage.setItem(
        "trips",
        JSON.stringify([...existingTrips, newTripData])
      );
    } catch (error) {
      console.error("Error saving trip:", error);
    }

    setShowTripModal(false);
  };

  const handleEditTrip = (index) => {
    setEditingTrip(index);
    setShowTripModal(true);
  };

  const handleDeleteTrip = (index) => {
    setTrips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectTrips = (selectedTrips) => {
    setTrips((prev) => [...prev, ...selectedTrips]);
    setShowTripSelector(false);
  };

  const handleSubmit = () => {
    if (!planName.trim()) {
      toast.error("请输入方案名称");
      return;
    }
    if (!trips.length) {
      toast.error("请至少添加一个行程");
      return;
    }

    // 确保所有行程都有正确的 ID
    const tripsWithIds = trips.map((trip) => {
      if (!trip.id) {
        return {
          ...trip,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
      }
      return trip;
    });

    onSubmit({
      ...initialValues,
      planName,
      trips: tripsWithIds,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBar}>
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="请输入方案名称"
            className={styles.nameInput}
          />
          <Button
            type="text"
            className={styles.statsToggle}
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? "收起详情" : "查看详情"}
          </Button>
        </div>

        <div className={`${styles.statsPanel} ${showStats ? styles.show : ""}`}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>🕒</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>总时长</div>
                <div className={styles.statValue}>{stats.duration}</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>总费用</div>
                <div className={styles.statValue}>¥{stats.totalPrice}</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>📍</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>途经城市</div>
                <div className={styles.statValue}>{stats.cities.length}个</div>
              </div>
            </div>
          </div>

          {stats.cities.length > 0 && (
            <div className={styles.cities}>
              <div className={styles.citiesLabel}>行程路线</div>
              <div className={styles.citiesList}>
                {stats.cities.map((city, index) => (
                  <span key={city} className={styles.city}>
                    {city}
                    {index < stats.cities.length - 1 && (
                      <span className={styles.arrow}>→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="trips">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.tripList}
              >
                {trips.length === 0 ? (
                  <Empty
                    icon="plan"
                    title="开始规划您的行程"
                    description="添加行程或从已有行程中选择"
                  >
                    <div className={styles.emptyActions}>
                      <Button
                        type="primary"
                        onClick={() => setShowTripModal(true)}
                      >
                        新建行程
                      </Button>
                      <Button onClick={() => setShowTripSelector(true)}>
                        选择已有行程
                      </Button>
                    </div>
                  </Empty>
                ) : (
                  <>
                    {trips.map((trip, index) => (
                      <Draggable
                        key={index}
                        draggableId={`trip-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.tripItem}
                          >
                            <TripCard
                              data={trip}
                              onEdit={() => handleEditTrip(index)}
                              onDelete={() => handleDeleteTrip(index)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    <div className={styles.addButton}>
                      <Button
                        type="dashed"
                        onClick={() => setShowTripSelector(true)}
                        style={{ marginRight: 8 }}
                      >
                        选择已有行程
                      </Button>
                      <Button
                        type="dashed"
                        onClick={() => setShowTripModal(true)}
                      >
                        新建行程
                      </Button>
                    </div>
                  </>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <Button type="secondary" block onClick={onCancel}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!planName.trim() || !trips.length}
          >
            保存方案
          </Button>
        </div>
      </div>

      <Modal
        visible={showTripModal}
        title={editingTrip !== null ? "编辑行程" : "添加行程"}
        onClose={() => {
          setShowTripModal(false);
          setEditingTrip(null);
        }}
        width={720}
        footer={null}
      >
        <TripForm
          initialData={editingTrip !== null ? trips[editingTrip] : undefined}
          onSubmit={handleAddTrip}
          onCancel={() => {
            setShowTripModal(false);
            setEditingTrip(null);
          }}
        />
      </Modal>

      <Modal
        visible={showTripSelector}
        onClose={() => setShowTripSelector(false)}
        title="选择行程"
        width={800}
        footer={null}
      >
        <TripSelector
          trips={allTrips}
          selectedTrips={trips}
          onSubmit={handleSelectTrips}
          onCancel={() => setShowTripSelector(false)}
        />
      </Modal>
    </div>
  );
}

PlanCreate.defaultProps = {
  initialValues: null,
};

export default PlanCreate;
