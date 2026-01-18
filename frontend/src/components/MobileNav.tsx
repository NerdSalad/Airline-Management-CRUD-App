import { NavLink } from "react-router-dom";
import { Plane, Users, Ticket, XCircle, LayoutDashboard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/flights", icon: Plane, label: "Flights" },
  { to: "/passengers", icon: Users, label: "Passengers" },
  { to: "/book-flight", icon: Calendar, label: "Book" },
  { to: "/reservations", icon: Ticket, label: "Reservations" },
  { to: "/cancellations", icon: XCircle, label: "Cancel" },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t shadow-elegant lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
