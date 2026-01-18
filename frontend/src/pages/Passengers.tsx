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
  getPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
} from "@/services/api";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    aadhar: "",
    phone: "",
    address: "",
    gender: "",
    email: "",
  });

  useEffect(() => {
    loadPassengers();
  }, []);

  const loadPassengers = async () => {
    try {
      const data = await getPassengers();
      setPassengers(data);
    } catch (err) {
      toast.error("Failed to load passengers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPassenger) {
        await updatePassenger(editingPassenger.aadhar, formData);
        toast.success("Passenger updated successfully");
      } else {
        await addPassenger(formData);
        toast.success("Passenger added successfully");
      }
      handleCloseModal();
      loadPassengers();
    } catch (err) {
      toast.error("Error saving passenger");
    }
  };

  const handleEdit = (p) => {
    setEditingPassenger(p);
    setFormData({
      name: p.name,
      nationality: p.nationality,
      aadhar: p.aadhar,
      phone: p.phone,
      address: p.address,
      gender: p.gender,
      email: p.email,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (aadhar) => {
    try {
      await deletePassenger(aadhar);
      toast.success("Passenger deleted successfully");
      loadPassengers();
    } catch (err) {
      toast.error("Error deleting passenger");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPassenger(null);
    setFormData({
      name: "",
      nationality: "",
      aadhar: "",
      phone: "",
      address: "",
      gender: "",
      email: "",
    });
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
              <h1 className="text-3xl font-bold mb-2">Passengers</h1>
              <p className="text-muted-foreground">Manage passenger details</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-primary text-white shadow-lg hover:shadow-xl gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Passenger
            </Button>
          </div>

          <Card className="glass-effect shadow-elegant overflow-hidden">
            {passengers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No passengers found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Nationality</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Aadhar</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Gender</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {passengers.map((p) => (
                      <tr
                        key={p.aadhar}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{p.name}</td>
                        <td className="px-6 py-4">{p.nationality}</td>
                        <td className="px-6 py-4">{p.aadhar}</td>
                        <td className="px-6 py-4">{p.phone}</td>
                        <td className="px-6 py-4">{p.address}</td>
                        <td className="px-6 py-4">{p.gender}</td>
                        <td className="px-6 py-4">{p.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(p)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(p.aadhar)}
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
              </div>
            )}
          </Card>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPassenger ? "Edit Passenger" : "Add New Passenger"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", label: "Name", placeholder: "e.g., Rohan Mehta" },
            { id: "nationality", label: "Nationality", placeholder: "e.g., Indian" },
            { id: "aadhar", label: "Aadhar", placeholder: "e.g., 123456789012" },
            { id: "phone", label: "Phone", placeholder: "e.g., 9876543210" },
            { id: "address", label: "Address", placeholder: "e.g., Mumbai, India" },
            { id: "gender", label: "Gender", placeholder: "e.g., Male" },
            { id: "email", label: "Email", placeholder: "e.g., rohan@gmail.com" },
          ].map((field) => (
            <div className="space-y-2" key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                value={formData[field.id]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
                placeholder={field.placeholder}
                required
                disabled={editingPassenger && field.id === "aadhar"}
              />
            </div>
          ))}
          <Button type="submit" className="w-full gradient-primary text-white">
            {editingPassenger ? "Update Passenger" : "Add Passenger"}
          </Button>
        </form>
      </Modal>

      <MobileNav />
    </div>
  );
};

export default Passengers;