import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import airplaneBg from "@/assets/airplane-bg.jpg";
import { Card } from "@/components/ui/card";
import { getAllReservations } from "@/services/api";

interface Reservation {
  PNR: string;
  TICKET: string;
  name: string;
  nationality: string;
  flightname: string;
  flightcode: string;
  src: string;
  des: string;
  formatted_date: string; // ✅ changed from ddate to formatted_date
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    try {
      const data = await getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-[0.08] dark:opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${airplaneBg})` }}
      />
      
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 pt-16 pb-20 lg:pb-8">
        <div className="container mx-auto p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">Reservations</h1>
            <Button onClick={fetchReservations}>
              <Plus className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>

          <Card className="glass-effect shadow-elegant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">PNR</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ticket No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Passenger</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nationality</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Flight</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map((r) => (
                    <tr key={r.PNR} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{r.PNR}</td>
                      <td className="px-6 py-4">{r.TICKET}</td>
                      <td className="px-6 py-4">{r.name}</td>
                      <td className="px-6 py-4">{r.nationality}</td>
                      <td className="px-6 py-4">{r.flightname} ({r.flightcode})</td>
                      <td className="px-6 py-4">{r.src} → {r.des}</td>
                      <td className="px-6 py-4">{r.formatted_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

export default Reservations;
