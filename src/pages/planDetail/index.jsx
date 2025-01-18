import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import TripCard from "../../components/TripCard";
import PlanCreate from "../planCreate/index";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toast";
import styles from "./PlanDetail.module.css";
import Icon from "../../components/Icon";
import { createRoot } from "react-dom/client";
import ExportTemplate from "../../components/ExportTemplate";

function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [plan, setPlan] = useState(null);
  const contentRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const currentPlan = savedPlans.find((p) => p.id === Number(id));
    if (currentPlan) {
      setPlan(currentPlan);
    } else {
      toast.error("方案不存在");
      navigate("/travelPlanerV2/");
    }
  }, [id, navigate, toast]);

  const stats = useMemo(() => {
    if (!plan?.trips?.length) return null;

    const start = new Date(plan.trips[0].departureTime);
    const end = new Date(plan.trips[plan.trips.length - 1].arrivalTime);
    const hours = Math.floor((end - start) / (1000 * 60 * 60));

    const totalPrice = plan.trips.reduce(
      (sum, trip) => sum + Number(trip.price) + Number(trip.hotel?.price || 0),
      0
    );

    const cities = Array.from(
      new Set(
        plan.trips.flatMap((trip) => [
          trip.departureCity,
          ...(trip.stopover ? [trip.stopover.city] : []),
          trip.arrivalCity,
        ])
      )
    );

    return {
      duration: `${hours}h`,
      totalPrice,
      cities,
    };
  }, [plan]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const template = document.createElement("div");
      template.style.position = "fixed";
      template.style.left = "-9999px";
      document.body.appendChild(template);

      const root = createRoot(template);
      root.render(<ExportTemplate data={plan} />);

      // 等待图片加载
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(template, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        width: 375,
      });

      document.body.removeChild(template);
      root.unmount();

      const link = document.createElement("a");
      link.download = `${plan.planName}-行程方案.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("导出成功");
    } catch (error) {
      toast.error("导出失败");
    } finally {
      setExporting(false);
    }
  };

  const handleCreatePlan = (updatedPlan) => {
    const plans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const updatedPlans = plans.map((p) =>
      p.id === updatedPlan.id ? updatedPlan : p
    );
    localStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
    setPlan(updatedPlan);
    setShowPlanForm(false);
    toast.success("保存成功");
  };

  const handleCancelCreate = () => {
    setShowPlanForm(false);
  };

  if (!plan || !stats) return null;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.content} ${exporting ? styles.exporting : ""}`}
        ref={contentRef}
      >
        <div className={styles.banner}>
          <div className={styles.planName}>{plan.planName}</div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{plan.trips.length}程</div>
              <div className={styles.statLabel}>行程</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.duration}</div>
              <div className={styles.statLabel}>时长</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <div className={styles.statValue}>¥{stats.totalPrice}</div>
              <div className={styles.statLabel}>总价</div>
            </div>
          </div>
        </div>

        <div className={styles.trips}>
          {plan.trips.map((trip, index) => (
            <div key={index} className={styles.tripCard}>
              <div className={styles.perforationLeft} />
              <div className={styles.perforationRight} />
              <TripCard data={trip} />
            </div>
          ))}
        </div>

        {exporting && (
          <div className={styles.exportFooter}>
            <div className={styles.brand}>
              <div className={styles.logo}>✈️ 春运助手</div>
              <div className={styles.slogan}>让回家的路更简单</div>
            </div>
            <div className={styles.qrCode}>
              <div className={styles.qrPlaceholder} />
              <div className={styles.qrText}>扫码规划行程</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/travelPlanerV2/")}
          title="返回"
        >
          <Icon type="back" />
        </button>
        <button
          className={styles.actionButton}
          onClick={handleExport}
          disabled={exporting}
          title="导出图片"
        >
          <Icon type="export" />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setShowPlanForm(true)}
          title="编辑方案"
        >
          <Icon type="edit" />
        </button>
      </div>

      <Modal
        visible={showPlanForm}
        onClose={() => setShowPlanForm(false)}
        title="修改方案"
        width={800}
        footer={null}
      >
        <PlanCreate
          initialValues={plan}
          onSubmit={handleCreatePlan}
          onCancel={handleCancelCreate}
        />
      </Modal>
    </div>
  );
}

export default PlanDetail;
