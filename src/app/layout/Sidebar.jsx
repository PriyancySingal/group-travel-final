import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Building,
  Users,
  Globe
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Group Events", icon: Calendar },
  { to: "/events/1/inventory", label: "Inventory", icon: Building },
  { to: "/guests", label: "Guest Bookings", icon: Users },
  { to: "/booking", label: "Microsite", icon: Globe }
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-white/10 p-5">
      <h1 className="text-xl font-bold mb-8 text-purple-400">TBO Groups</h1>

      <div className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                ? "bg-purple-600"
                : "hover:bg-white/10 text-gray-300"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
