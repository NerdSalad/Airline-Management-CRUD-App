import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import airplaneBg from "@/assets/airplane-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getPassengerByAadhar, getFlightByRoute, bookFlight, getFlights } from "@/services/api";

const BookFlight = () => {
  const [passenger, setPassenger] = useState({
    aadhar: "",
    name: "",
    nationality: "",
    address: "",
    gender: "",
  });

  const [flight, setFlight] = useState({
    f_name: "",
    f_code: "",
    source: "",
    destination: "",
  });

  const [journeyDate, setJourneyDate] = useState<Date | undefined>(undefined);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [fetchingPassenger, setFetchingPassenger] = useState(false);
  const [fetchingFlight, setFetchingFlight] = useState(false);

  // ✅ Fetch all cities from flights data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const flights = await getFlights();
        const allSources = flights.map((f: any) => f.source);
        const allDestinations = flights.map((f: any) => f.destination);
        const allCities = [...allSources, ...allDestinations];
        const uniqueCities = Array.from(new Set(allCities)).sort();
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({
          title: "Error",
          description: "Failed to load cities data",
          variant: "destructive"
        });
        setCities([
          "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
          "Goa", "Amritsar", "Ayodhya", "Pune", "Kochi", "Bhubaneswar",
          "Patna", "Ahmedabad", "Varanasi"
        ]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // ✅ Fetch Passenger Details - UPDATED to handle field name mapping
  const fetchPassenger = async () => {
    if (!passenger.aadhar) {
      toast({ title: "Error", description: "Enter Aadhar number", variant: "destructive" });
      return;
    }

    if (!/^\d{4}-\d{4}-\d{4}$/.test(passenger.aadhar)) {
      toast({ title: "Error", description: "Aadhar number must be 12 digits", variant: "destructive" });
      return;
    }

    setFetchingPassenger(true);
    try {
      console.log("Fetching passenger with Aadhar:", passenger.aadhar);
      const data = await getPassengerByAadhar(passenger.aadhar);
      console.log("Raw passenger data:", data);

      // ✅ Handle field name mapping - your backend uses "andhar" instead of "aadhar"
      const mappedData = {
        name: data.name || "",
        nationality: data.nationality || "",
        address: data.address || "",
        gender: data.gender || "",
        // Map "andhar" to "aadhar" for frontend consistency
        aadhar: data.aadhar || data.andhar || passenger.aadhar
      };

      console.log("Mapped passenger data:", mappedData);
      
      setPassenger({
        ...passenger,
        ...mappedData
      });
      
      toast({ 
        title: "Passenger Found", 
        description: `Name: ${mappedData.name}` 
      });
    } catch (error: any) {
      console.error("Error fetching passenger:", error);
      
      // More specific error message
      if (error.response?.status === 404) {
        toast({ 
          title: "Passenger Not Found", 
          description: "No passenger found with this Aadhar number. Please check the number or add the passenger first.",
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: error.response?.data?.message || "Failed to fetch passenger details", 
          variant: "destructive" 
        });
      }
    } finally {
      setFetchingPassenger(false);
    }
  };

  // ✅ Fetch Flight by Route
  const fetchFlightDetails = async () => {
    if (!flight.source || !flight.destination) {
      toast({ title: "Error", description: "Select source and destination", variant: "destructive" });
      return;
    }

    if (flight.source === flight.destination) {
      toast({ title: "Error", description: "Source and destination cannot be the same", variant: "destructive" });
      return;
    }

    setFetchingFlight(true);
    try {
      console.log("Fetching flight from:", flight.source, "to:", flight.destination);
      const flights = await getFlightByRoute(flight.source, flight.destination);
      console.log("Flight data:", flights);
      
      if (flights && flights.length > 0) {
        const f = flights[0];
        setFlight({
          ...flight,
          f_name: f.f_name || f.flightname || f.name || "",
          f_code: f.f_code || f.flightcode || f.code || "",
        });
        toast({ title: "Flight Found", description: `Flight: ${f.f_name || f.flightname} (${f.f_code || f.flightcode})` });
      } else {
        toast({ title: "Error", description: "No flights found for this route", variant: "destructive" });
        setFlight({
          ...flight,
          f_name: "",
          f_code: "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching flight:", error);
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Server error while fetching flight", 
        variant: "destructive" 
      });
    } finally {
      setFetchingFlight(false);
    }
  };

  // ✅ Book Flight - UPDATED to handle field mapping
  const handleBookFlight = async () => {
    if (!passenger.name || !flight.f_code || !journeyDate) {
      toast({ title: "Error", description: "Please fill all details before booking", variant: "destructive" });
      return;
    }

    try {
      console.log("Booking flight with data:", {
        aadhar: passenger.aadhar,
        name: passenger.name,
        nationality: passenger.nationality,
        flightname: flight.f_name,
        flightcode: flight.f_code,
        src: flight.source,
        des: flight.destination,
        ddate: format(journeyDate, "dd MMM yyyy"),
      });

      // Use the correct field name that your backend expects
      const bookingData = {
        aadhar: passenger.aadhar, // or use andhar: passenger.aadhar if backend expects "andhar"
        name: passenger.name,
        nationality: passenger.nationality,
        flightname: flight.f_name,
        flightcode: flight.f_code,
        src: flight.source,
        des: flight.destination,
        ddate: format(journeyDate, "dd MMM yyyy"),
      };

      const data = await bookFlight(bookingData);

      console.log("Booking response:", data);

      toast({
        title: "✅ Flight Booked Successfully",
        description: `PNR: ${data.pnr}`,
      });

      // Reset form
      setPassenger({ aadhar: "", name: "", nationality: "", address: "", gender: "" });
      setFlight({ f_name: "", f_code: "", source: "", destination: "" });
      setJourneyDate(undefined);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Booking failed", 
        variant: "destructive" 
      });
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
      <div className="lg:ml-64 pt-16 pb-20 lg:pb-8">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="glass-effect rounded-2xl shadow-elegant-xl p-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Book Flight
            </h1>

            <div className="space-y-6">
              {/* Passenger Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    value={passenger.aadhar}
                    onChange={(e) => setPassenger({ ...passenger, aadhar: e.target.value })}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={15}
                  />
                </div>
                <Button 
                  onClick={fetchPassenger} 
                  className="w-full"
                  disabled={fetchingPassenger}
                >
                  <Search className="mr-2 h-4 w-4" /> 
                  {fetchingPassenger ? "Fetching..." : "Fetch"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={passenger.name} readOnly placeholder="Name will appear here" />
                </div>
                <div>
                  <Label>Nationality</Label>
                  <Input value={passenger.nationality} readOnly placeholder="Nationality will appear here" />
                </div>
              </div>

              {/* Additional passenger info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Address</Label>
                  <Input value={passenger.address} readOnly placeholder="Address will appear here" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input value={passenger.gender} readOnly placeholder="Gender will appear here" />
                </div>
              </div>

              {/* Flight Section */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Select
                      value={flight.source}
                      onValueChange={(value) => setFlight({ ...flight, source: value, f_name: "", f_code: "" })}
                    >
                      <SelectTrigger id="source">
                        <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select Source"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Select
                      value={flight.destination}
                      onValueChange={(value) => setFlight({ ...flight, destination: value, f_name: "", f_code: "" })}
                    >
                      <SelectTrigger id="destination">
                        <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select Destination"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={fetchFlightDetails} 
                    className="w-full"
                    disabled={!flight.source || !flight.destination || flight.source === flight.destination || fetchingFlight}
                  >
                    <Search className="mr-2 h-4 w-4" /> 
                    {fetchingFlight ? "Searching..." : "Fetch Flight"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Flight Name</Label>
                  <Input value={flight.f_name} readOnly placeholder="Flight name will appear here" />
                </div>
                <div>
                  <Label>Flight Code</Label>
                  <Input value={flight.f_code} readOnly placeholder="Flight code will appear here" />
                </div>
              </div>

              {/* Journey Date */}
              <div>
                <Label>Journey Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !journeyDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {journeyDate ? format(journeyDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={journeyDate}
                      onSelect={setJourneyDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                onClick={handleBookFlight} 
                className="w-full mt-6" 
                size="lg"
                disabled={!passenger.name || !flight.f_code || !journeyDate}
              >
                Book Flight
              </Button>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default BookFlight;