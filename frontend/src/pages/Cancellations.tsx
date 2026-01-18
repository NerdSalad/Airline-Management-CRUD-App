import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { toast } from "sonner";
import { getReservationByPNR, cancelTicket } from "@/services/api";
import airplaneBg from "@/assets/airplane-bg.jpg";

interface Reservation {
  PNR: string;
  TICKET: string;
  name: string;
  nationality: string;
  flightname: string;
  flightcode: string;
  src: string;
  des: string;
  formatted_date: string;
}

const Cancellations = () => {
  const [pnr, setPnr] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr) {
      toast.error("Please enter a PNR number");
      return;
    }

    try {
      const data = await getReservationByPNR(pnr);
      setReservation(data);
      toast.success("Reservation found");
    } catch (err: any) {
      toast.error("No reservation found for this PNR");
      setReservation(null);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    try {
      await cancelTicket(reservation.PNR);
      toast.success(`Ticket ${reservation.PNR} cancelled successfully`);
      setReservation(null);
      setPnr("");
    } catch (err) {
      toast.error("Error cancelling the ticket");
    }
  };

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
          <div>
            <h1 className="text-3xl font-bold mb-2">Ticket Cancellation</h1>
            <p className="text-muted-foreground">Search and cancel tickets by PNR</p>
          </div>

          {/* Search Section */}
          <Card className="p-6 glass-effect shadow-elegant">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pnr">Enter PNR Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="pnr"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    placeholder="e.g., PNR-10023"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="gradient-primary text-white gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Reservation Details */}
          {reservation && (
            <Card className="p-6 glass-effect shadow-elegant space-y-4">
              <h3 className="text-xl font-bold mb-2">Reservation Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><strong>PNR:</strong> {reservation.PNR}</p>
                <p><strong>Ticket:</strong> {reservation.TICKET}</p>
                <p><strong>Name:</strong> {reservation.name}</p>
                <p><strong>Nationality:</strong> {reservation.nationality}</p>
                <p><strong>Flight:</strong> {reservation.flightname} ({reservation.flightcode})</p>
                <p><strong>Route:</strong> {reservation.src} → {reservation.des}</p>
                <p><strong>Date:</strong> {reservation.formatted_date}</p>
              </div>

              <Button
                onClick={handleCancel}
                variant="destructive"
                className="gap-2 shadow-lg hover:shadow-xl"
              >
                <Trash2 className="h-4 w-4" />
                Cancel Ticket
              </Button>
            </Card>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Cancellations;
