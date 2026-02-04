import { useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import AttendanceChart from "../../components/reports/AttendanceChart";
import SatisfactionChart from "../../components/reports/SatisfactionChart";
import RevenueCard from "../../components/reports/RevenueCard";
import UtilizationChart from "../../components/reports/UtilizationChart";
import BookingTrends from "../../components/reports/BookingTrends";
import SupplierPerformance from "../../components/reports/SupplierPerformance";
import ExportButton from "../../components/reports/ExportButton";
import Button from "../../components/ui/Button";

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30days");

  const handleExport = (format) => {
    // In real implementation, this would generate and download the report
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8">

      {/* Header with Export Options */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Event Reports</h1>
          <p className="text-gray-400 mt-1">Read-only insights and performance analytics</p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          <ExportButton format="Excel" onExport={() => handleExport('excel')} />
          <ExportButton format="PDF" onExport={() => handleExport('pdf')} />
        </div>
      </div>

      {/* Revenue & Margin Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Revenue & Margin Analysis</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <RevenueCard
            title="Total Revenue"
            value="₹12.4L"
            change={15.3}
            period="vs last month"
          />
          <RevenueCard
            title="Net Margin"
            value="28.5%"
            change={2.1}
            period="vs last month"
          />
          <RevenueCard
            title="Avg. Revenue/Event"
            value="₹2.1L"
            change={8.7}
            period="vs last month"
          />
          <RevenueCard
            title="Cost Savings"
            value="₹1.8L"
            change={12.4}
            period="vs last month"
          />
        </div>
      </div>

      {/* Attendance & Satisfaction */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Guest Analytics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <AttendanceChart />
          <SatisfactionChart />
        </div>
      </div>

      {/* Resource Utilization */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Inventory Utilization</h2>
        <UtilizationChart />
      </div>

      {/* Booking Trends */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Booking Trends</h2>
        <BookingTrends />
      </div>

      {/* Supplier Performance */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Supplier Performance</h2>
        <SupplierPerformance />
      </div>

      {/* Financial Reconciliation Summary */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Financial Reconciliation</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-400 mb-2">Total Bookings</div>
            <div className="text-2xl font-bold text-white">324</div>
            <div className="text-sm text-green-400">+12% vs last period</div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">Payment Collected</div>
            <div className="text-2xl font-bold text-white">₹10.2L</div>
            <div className="text-sm text-green-400">98.5% collection rate</div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">Pending Reconciliation</div>
            <div className="text-2xl font-bold text-yellow-400">₹0.8L</div>
            <div className="text-sm text-gray-400">3 transactions pending</div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-center gap-4 pt-8 border-t border-white/10">
        <Button onClick={() => handleExport('pdf')}>
          Generate Full Report
        </Button>
        <button className="border border-white/20 hover:bg-white/10 px-6 py-2 rounded-lg transition-colors">
          Schedule Reports
        </button>
      </div>
    </div>
  );
}
