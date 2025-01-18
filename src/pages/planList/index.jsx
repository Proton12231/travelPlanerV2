import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Confirm from "../../components/Modal/Confirm";
import toast from "../../components/Toast";
import PlanCreate from "../planCreate";
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
    if (window.confirm("确定要取消创建吗？已编辑的内容将会丢失")) {
      setShowCreateModal(false);
    }
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

      <div className={styles.grid}>
        {plans.map((plan) => (
          <div key={plan.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.planName}>{plan.planName}</h3>
              <div className={styles.actions}>
                <Button
                  type="secondary"
                  size="small"
                  onClick={() => navigate(`/plan/${plan.id}`)}
                >
                  查看
                </Button>
                <Button
                  type="danger"
                  size="small"
                  onClick={() => handleDeletePlan(plan)}
                >
                  删除
                </Button>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.label}>行程数</span>
                <span className={styles.value}>{plan.trips?.length || 0}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>总时长</span>
                <span className={styles.value}>
                  {getTotalDuration(plan.trips)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>总价格</span>
                <span className={styles.value}>
                  ¥{getTotalPrice(plan.trips)}
                </span>
              </div>
            </div>
            <div className={styles.time}>
              创建时间：
              {new Date(plan.createdAt).toLocaleString("zh-CN")}
            </div>
          </div>
        ))}
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
