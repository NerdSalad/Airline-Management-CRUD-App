import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import airplaneBg from "@/assets/airplane-bg.jpg";
import Modal from "@/components/Modal";
import { toast } from "sonner";
import {
  getFlights,
  addFlight,
  updateFlight,
  deleteFlight,
} from "@/services/api";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    f_code: "",
    f_name: "",
    source: "",
    destination: "",
  });

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const data = await getFlights();
      setFlights(data);
    } catch {
      toast.error("Failed to load flights");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlight) {
        await updateFlight(editingFlight.f_code, formData);
        toast.success("Flight updated successfully");
      } else {
        await addFlight(formData);
        toast.success("Flight added successfully");
      }
      handleCloseModal();
      loadFlights();
    } catch {
      toast.error("Error saving flight");
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      f_code: flight.f_code,
      f_name: flight.f_name,
      source: flight.source,
      destination: flight.destination,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (f_code) => {
    try {
      await deleteFlight(f_code);
      toast.success("Flight deleted successfully");
      loadFlights();
    } catch {
      toast.error("Error deleting flight");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFlight(null);
    setFormData({ f_code: "", f_name: "", source: "", destination: "" });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Flights</h1>
              <p className="text-muted-foreground">Manage all flight information</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-primary text-white shadow-lg hover:shadow-xl gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Flight
            </Button>
          </div>

          <Card className="glass-effect shadow-elegant overflow-hidden">
            <div className="overflow-x-auto">
              {flights.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  No flights found.
                </p>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Flight Code</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Flight Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Source</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Destination</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {flights.map((flight) => (
                      <tr key={flight.f_code} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{flight.f_code}</td>
                        <td className="px-6 py-4">{flight.f_name}</td>
                        <td className="px-6 py-4">{flight.source}</td>
                        <td className="px-6 py-4">{flight.destination}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(flight)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(flight.f_code)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFlight ? "Edit Flight" : "Add New Flight"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries({
            f_code: "Flight Code",
            f_name: "Flight Name",
            source: "Source",
            destination: "Destination",
          }).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder={`Enter ${label}`}
                required
              />
            </div>
          ))}
          <Button type="submit" className="w-full gradient-primary text-white">
            {editingFlight ? "Update Flight" : "Add Flight"}
          </Button>
        </form>
      </Modal>

      <MobileNav />
    </div>
  );
};

export default Flights;
