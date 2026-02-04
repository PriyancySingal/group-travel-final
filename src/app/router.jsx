import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import EventsList from "../pages/Events/EventsList";
import EventSetup from "../pages/Events/EventSetup";
import Guests from "../pages/Guests/Guests";
import Resources from "../pages/Resources/Resources";
import RoomAllocation from "../pages/Resources/RoomAllocation";
import InventoryDashboard from "../pages/Inventory/InventoryDashboard";
import Hotels from "../pages/Inventory/Hotels";
import OperationsCenter from "../pages/Operations/OperationsCenter";
import BookingFlow from "../pages/Booking/BookingFlow";
import AIInsights from "../pages/AIInsights/AIInsights";
import Reports from "../pages/Reports/Reports";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/booking" element={<BookingFlow />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/new" element={<EventSetup />} />
          <Route path="/events/:id/setup" element={<EventSetup />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/events/:id/resources/rooms" element={<RoomAllocation />} />
          <Route path="/events/:id/inventory" element={<InventoryDashboard />} />
          <Route path="/events/:id/inventory/hotels" element={<Hotels />} />
          <Route path="/operations" element={<OperationsCenter />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
