import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Plane, Users, Calendar, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import airplaneBg from "@/assets/airplane-bg.jpg";
import { useNavigate } from "react-router-dom";
import {
  getFlights,
  getPassengers,
  getAllReservations,
} from "@/services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    flights: 0,
    passengers: 0,
    reservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flights, passengers, reservations] = await Promise.all([
          getFlights(),
          getPassengers(),
          getAllReservations(),
        ]);

        setStats({
          flights: flights.length,
          passengers: passengers.length,
          reservations: reservations.length,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Flights",
      value: loading ? "..." : stats.flights,
      icon: Plane,
      color: "text-primary",
      bg: "bg-primary/10",
      path: "/flights",
    },
    {
      title: "Active Passengers",
      value: loading ? "..." : stats.passengers,
      icon: Users,
      color: "text-accent",
      bg: "bg-accent/10",
      path: "/passengers",
    },
    {
      title: "Reservations",
      value: loading ? "..." : stats.reservations,
      icon: X,
      color: "text-success",
      bg: "bg-success/10",
      path: "/reservations",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-[0.08] dark:opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${airplaneBg})` }}
      />

      <Navbar />
      <Sidebar />

      <main className="lg:ml-64 pt-16 pb-20 lg:pb-8 relative z-10">
        <div className="container mx-auto p-6">
          {/* Header Section - Centered */}
          <div className="text-center mb-12 animate-fade-in">
            {/* 👇 Removed button wrapper, kept just the heading */}
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time overview of your airline operations
            </p>
          </div>

          {/* 📊 Stats Section - Centered with better spacing */}
          <div className="flex justify-center mb-16 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
              {statCards.map((stat, index) => (
                <Card
                  key={index}
                  className="p-8 glass-effect shadow-elegant hover:shadow-elegant-lg transition-all duration-300 animate-slide-up cursor-pointer hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(stat.path)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl ${stat.bg} mb-4`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                    <p className="text-lg text-muted-foreground font-medium">{stat.title}</p>
                    {!loading && (
                      <span className="text-sm font-medium text-success mt-2">
                        +{Math.floor(Math.random() * 15)}%
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 🚀 Quick Actions - Centered */}
          <div className="flex justify-center animate-fade-in">
            <div className="max-w-4xl w-full">
              <Card className="p-8 glass-effect shadow-elegant">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold">Quick Actions</h3>
                  <p className="text-muted-foreground mt-2">
                    Quickly access frequently used features
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: "Add Flights", icon: Plane, path: "/flights" },
                    { label: "Book Flight", icon: Calendar, path: "/book-flight" },
                    { label: "Add Passenger", icon: Users, path: "/passengers" },
                    { label: "Cancellations", icon: X, path: "/cancellations" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className="p-6 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-3 hover:scale-105 group"
                    >
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Dashboard;