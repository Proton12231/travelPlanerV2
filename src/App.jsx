import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import PlanList from "./pages/planList";
import ItineraryList from "./pages/ItineraryList";
import NotFound from "./pages/notFound";
import { ToastProvider } from "./components/Toast";
import PlanDetail from "./pages/planDetail";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/travelPlanerV2/" element={<Layout />}>
          <Route index element={<PlanList />} />
          <Route path="/travelPlanerV2/plan/:id" element={<PlanDetail />} />
          <Route
            path="/travelPlanerV2/itineraries"
            element={<ItineraryList />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
