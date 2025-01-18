import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import PlanCard from "../../components/PlanCard";
import Modal from "../../components/Modal";
import Confirm from "../../components/Modal/Confirm";
import toast from "../../components/Toast";
import PlanCreate from "../planCreate";
import Icon from "../../components/Icon";
import Empty from "../../components/Empty";
import styles from "./PlanList.module.css";

function PlanList() {
  const [plans, setPlans] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const navigate = useNavigate();

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedPlans = localStorage.getItem("travelPlans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  // 保存数据到 localStorage
  const savePlans = (newPlans) => {
    localStorage.setItem("travelPlans", JSON.stringify(newPlans));
    setPlans(newPlans);
  };

  const handleCreatePlan = (planData) => {
    const newPlan = {
      id: Date.now(),
      ...planData,
      createdAt: new Date().toISOString(),
    };

    const newPlans = [...plans, newPlan];
    savePlans(newPlans);
    setShowCreateModal(false);
    toast.success("方案创建成功");
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
  };

  const handleDeletePlan = (plan) => {
    setDeletingPlan(plan);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const newPlans = plans.filter((p) => p.id !== deletingPlan.id);
    savePlans(newPlans);
    setShowDeleteConfirm(false);
    setDeletingPlan(null);
    toast.success("方案删除成功");
  };

  const getTotalDuration = (trips) => {
    if (!trips?.length) return "0小时";
    const start = new Date(trips[0].departureTime);
    const end = new Date(trips[trips.length - 1].arrivalTime);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));
    return `${hours}小时`;
  };

  const getTotalPrice = (trips) => {
    if (!trips?.length) return 0;
    return trips.reduce((sum, trip) => {
      return sum + trip.price + (trip.hotel?.price || 0);
    }, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>我的行程方案</h2>
        <Button onClick={() => setShowCreateModal(true)}>新建方案</Button>
      </div>

      <div className={styles.content}>
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={styles.planCard}
              onClick={() => navigate(`/plan/${plan.id}`)}
            >
              <PlanCard data={plan} onDelete={() => handleDeletePlan(plan)} />
            </div>
          ))
        ) : (
          <Empty
            icon="plan"
            title="暂无方案"
            description="点击右上角按钮创建第一个方案"
          />
        )}
      </div>

      <Modal
        visible={showCreateModal}
        title="新建方案"
        onClose={() => setShowCreateModal(false)}
        width={800}
        footer={null}
      >
        <PlanCreate onSubmit={handleCreatePlan} onCancel={handleCancelCreate} />
      </Modal>

      <Confirm
        visible={showDeleteConfirm}
        title="删除确认"
        content={`确定要删除方案"${deletingPlan?.planName}"吗？此操作不可恢复。`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeletingPlan(null);
        }}
        confirmType="danger"
      />
    </div>
  );
}

export default PlanList;
