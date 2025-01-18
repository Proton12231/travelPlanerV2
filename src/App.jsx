import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import PlanList from "./pages/planList";
import ItineraryList from "./pages/ItineraryList";
import NotFound from "./pages/notFound";
import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PlanList />} />
          <Route path="itineraries" element={<ItineraryList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
