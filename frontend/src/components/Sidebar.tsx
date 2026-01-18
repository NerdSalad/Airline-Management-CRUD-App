import { NavLink } from "react-router-dom";
import {
  Plane,
  Users,
  Ticket,
  XCircle,
  LayoutDashboard,
  Calendar,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/flights", icon: Plane, label: "Flights" },
  { to: "/passengers", icon: Users, label: "Passengers" },
  { to: "/book-flight", icon: Calendar, label: "Book Flight" },
  { to: "/reservations", icon: Ticket, label: "Reservations" },
  { to: "/cancellations", icon: XCircle, label: "Cancellations" },
  { to: "/boarding-pass", icon: ScanLine, label: "Boarding Pass" }, // ✅ new item
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass-effect border-r shadow-elegant hidden lg:block">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                "hover:bg-primary/10 hover:shadow-md",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;