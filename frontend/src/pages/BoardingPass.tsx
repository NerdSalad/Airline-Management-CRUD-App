// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import MobileNav from "@/components/MobileNav";
// import airplaneBg from "@/assets/airplane-bg.jpg";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/hooks/use-toast";
// import { getBoardingPassByPNR } from "@/services/api";
// import { Card } from "@/components/ui/card";
// import { Plane, MapPin, Calendar, User, Loader2 } from "lucide-react";

// // ✅ Airline logos
// import airIndiaLogo from "@/assets/airindia.png";
// import goairLogo from "@/assets/goair.png";
// import indigoLogo from "@/assets/indigo.png";
// import vistaraLogo from "@/assets/vistara.png";
// import spicejetLogo from "@/assets/spicejet.png";

// const airlineLogos: Record<string, string> = {
//   AI: airIndiaLogo,
//   G8: goairLogo,
//   "6E": indigoLogo,
//   UK: vistaraLogo,
//   SG: spicejetLogo,
// };

// const airlineNames: Record<string, string> = {
//   AI: "Air India",
//   "6E": "IndiGo",
//   SG: "SpiceJet",
//   G8: "Go Air",
//   UK: "Vistara",
// };

// const BoardingPass = () => {
//   const [pnr, setPnr] = useState("");
//   const [details, setDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchBoardingPass = async () => {
//     if (!pnr.trim()) {
//       toast({
//         title: "Error",
//         description: "Enter a valid PNR",
//         variant: "destructive",
//       });
//       return;
//     }

//     const formattedPnr = pnr.startsWith("PNR-") ? pnr : `PNR-${pnr}`;
//     console.log("🛰 Fetching boarding pass for:", formattedPnr);
//     setLoading(true);

//     try {
//       const data = await getBoardingPassByPNR(formattedPnr);
//       console.log("✅ Boarding pass data received:", data);
//       setDetails(data);
//       toast({
//         title: "✈️ Boarding Pass Found",
//         description: `Welcome, ${data.passenger_name || data.name}!`,
//       });
//     } catch (err) {
//       console.error("❌ Error fetching boarding pass:", err);
//       setDetails(null);
//       toast({
//         title: "Error",
//         description: "PNR not found. Please check and try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Extract airline prefix safely
//   const getAirlinePrefix = (flightName: string) => {
//     if (!flightName) return null;
//     const prefix = flightName.split("-")[0];
//     return prefix in airlineLogos ? prefix : null;
//   };

//   const getAirlineLogo = (flightName: string) => {
//     const prefix = getAirlinePrefix(flightName);
//     return prefix ? airlineLogos[prefix] : null;
//   };

//   const getAirlineName = (flightName: string) => {
//     const prefix = getAirlinePrefix(flightName);
//     return prefix ? airlineNames[prefix] : "Unknown Airline";
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div
//         className="fixed inset-0 bg-cover bg-center opacity-[0.08] dark:opacity-[0.06] pointer-events-none"
//         style={{ backgroundImage: `url(${airplaneBg})` }}
//       />

//       <Navbar />
//       <Sidebar />
//       <div className="lg:ml-64 pt-16 pb-20 lg:pb-8">
//         <div className="container mx-auto p-6 max-w-6xl">
//           <div className="w-full max-w-4xl mx-auto space-y-6">
//             {/* Search Card */}
//             <Card className="glass-effect rounded-2xl shadow-elegant-xl p-8 animate-fade-in">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-primary/10 rounded-xl">
//                   <Plane className="w-6 h-6 text-primary" />
//                 </div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//                   Boarding Pass
//                 </h1>
//               </div>

//               <div className="flex items-end gap-3">
//                 <div className="flex-1">
//                   <Label className="text-sm font-semibold mb-2 block">
//                     Enter PNR Number
//                   </Label>
//                   <Input
//                     value={pnr}
//                     onChange={(e) => setPnr(e.target.value.toUpperCase())}
//                     onKeyPress={(e) => e.key === "Enter" && fetchBoardingPass()}
//                     placeholder="e.g., PNR-84757 or 84757"
//                     className="h-11"
//                     disabled={loading}
//                   />
//                 </div>
//                 <Button onClick={fetchBoardingPass} className="h-11 px-8" disabled={loading}>
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Fetching...
//                     </>
//                   ) : (
//                     "Fetch"
//                   )}
//                 </Button>
//               </div>
//             </Card>

//             {/* Boarding Pass Display */}
//             {details && (
//               <Card className="glass-effect rounded-2xl shadow-elegant-xl overflow-hidden animate-fade-in border-2">
//                 {/* Header Section */}
//                 <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b-2 border-dashed">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       {getAirlineLogo(details.flight_name) ? (
//                         <div className="bg-white p-3 rounded-xl shadow-md">
//                           <img
//                             src={getAirlineLogo(details.flight_name) || ""}
//                             alt="Airline Logo"
//                             className="h-12 w-12 object-contain"
//                             onError={(e) => (e.currentTarget.style.display = "none")}
//                           />
//                         </div>
//                       ) : (
//                         <div className="bg-primary/10 p-4 rounded-xl">
//                           <Plane className="h-10 w-10 text-primary" />
//                         </div>
//                       )}
//                       <div>
//                         <h2 className="text-2xl font-bold text-foreground">
//                           {getAirlineName(details.flight_name)}
//                         </h2>
//                         <p className="text-sm text-muted-foreground font-medium">
//                           Flight {details.flight_name}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-muted-foreground font-semibold uppercase">
//                         Boarding Pass
//                       </p>
//                       <p className="text-4xl">✈️</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="p-8">
//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     {/* Left */}
//                     <div className="space-y-4">
//                       <div className="bg-muted/30 rounded-xl p-4 border">
//                         <div className="flex items-center gap-2 text-muted-foreground mb-2">
//                           <User className="w-4 h-4" />
//                           <p className="text-xs font-semibold uppercase">Passenger Name</p>
//                         </div>
//                         <p className="text-lg font-bold text-foreground">
//                           {details.passenger_name || details.name}
//                         </p>
//                       </div>

//                       <div className="bg-muted/30 rounded-xl p-4 border">
//                         <div className="flex items-center gap-2 text-muted-foreground mb-2">
//                           <MapPin className="w-4 h-4" />
//                           <p className="text-xs font-semibold uppercase">Nationality</p>
//                         </div>
//                         <p className="text-lg font-bold text-foreground">
//                           {details.nationality}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="bg-muted/30 rounded-xl p-4 border">
//                           <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
//                             PNR
//                           </p>
//                           <p className="text-sm font-bold text-foreground">{details.PNR}</p>
//                         </div>
//                         <div className="bg-muted/30 rounded-xl p-4 border">
//                           <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
//                             Ticket No
//                           </p>
//                           <p className="text-sm font-bold text-foreground">{details.TICKET}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Right */}
//                     <div className="space-y-4">
//                       <div className="bg-muted/30 rounded-xl p-4 border">
//                         <div className="flex items-center gap-2 text-muted-foreground mb-2">
//                           <MapPin className="w-4 h-4" />
//                           <p className="text-xs font-semibold uppercase">From</p>
//                         </div>
//                         <p className="text-lg font-bold text-foreground">{details.source}</p>
//                       </div>

//                       <div className="bg-muted/30 rounded-xl p-4 border">
//                         <div className="flex items-center gap-2 text-muted-foreground mb-2">
//                           <MapPin className="w-4 h-4" />
//                           <p className="text-xs font-semibold uppercase">To</p>
//                         </div>
//                         <p className="text-lg font-bold text-foreground">{details.destination}</p>
//                       </div>

//                       <div className="bg-muted/30 rounded-xl p-4 border">
//                         <div className="flex items-center gap-2 text-muted-foreground mb-2">
//                           <Calendar className="w-4 h-4" />
//                           <p className="text-xs font-semibold uppercase">Date of Departure</p>
//                         </div>
//                         <p className="text-lg font-bold text-foreground">
//                           {details.formatted_date || details.ddate || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="border-t-2 border-dashed pt-6 text-center">
//                     <p className="text-muted-foreground font-medium">
//                       ✈️ Have a safe flight! | Airline Management System
//                     </p>
//                   </div>
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//       <MobileNav />
//     </div>
//   );
// };

// export default BoardingPass;

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import airplaneBg from "@/assets/airplane-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getBoardingPassByPNR } from "@/services/api";
import { Plane, Loader2 } from "lucide-react";

// ✅ Airline logos
import airIndiaLogo from "@/assets/airindia.png";
import goairLogo from "@/assets/goair.png";
import indigoLogo from "@/assets/indigo.png";
import vistaraLogo from "@/assets/vistara.png";
import spicejetLogo from "@/assets/spicejet.png";

const airlineLogos: Record<string, string> = {
  AI: airIndiaLogo,
  G8: goairLogo,
  "6E": indigoLogo,
  UK: vistaraLogo,
  SG: spicejetLogo,
};

const BoardingPass = () => {
  const [pnr, setPnr] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBoardingPass = async () => {
    if (!pnr.trim()) {
      toast({
        title: "Error",
        description: "Enter a valid PNR",
        variant: "destructive",
      });
      return;
    }

    const formattedPnr = pnr.startsWith("PNR-") ? pnr : `PNR-${pnr}`;
    setLoading(true);

    try {
      const data = await getBoardingPassByPNR(formattedPnr);
      setDetails(data);
      toast({
        title: "✈️ Boarding Pass Found",
        description: `Welcome, ${data.passenger_name || data.name}!`,
      });
    } catch {
      setDetails(null);
      toast({
        title: "Error",
        description: "PNR not found. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAirlineLogo = (code: string) => {
    if (!code) return null;
    const prefix = code.split("-")[0];
    return airlineLogos[prefix] || null;
  };

  const getAirlineName = (code: string) => {
    if (!code) return "Unknown Airline";
    const prefix = code.split("-")[0];
    const names: Record<string, string> = {
      AI: "Air India",
      "6E": "IndiGo",
      SG: "SpiceJet",
      G8: "Go Air",
      UK: "Vistara",
    };
    return names[prefix] || "Unknown Airline";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-[0.08] dark:opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${airplaneBg})` }}
      />

      <Navbar />
      <Sidebar />

      <div className="lg:ml-64 pt-16 pb-20 lg:pb-8">
        <div className="container mx-auto p-6 max-w-5xl">
          {/* Search Section */}
          <Card className="rounded-2xl p-8 shadow-lg backdrop-blur-md bg-white/70 dark:bg-slate-900/60 mb-10">
            <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              <Plane className="w-6 h-6" /> Boarding Pass Lookup
            </h1>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label className="text-sm font-semibold mb-2 block">
                  Enter PNR Number
                </Label>
                <Input
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && fetchBoardingPass()}
                  placeholder="e.g., PNR-84757 or 84757"
                  className="h-11"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={fetchBoardingPass}
                className="h-11 px-8"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch"
                )}
              </Button>
            </div>
          </Card>

          {/* Boarding Ticket Layout */}
          {details && (
            <div className="relative bg-gradient-to-br from-sky-100 to-sky-200 dark:from-slate-800 dark:to-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl overflow-hidden border">
              {/* Ticket Content */}
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-dashed divide-slate-400">
                {/* Left section - Main ticket */}
                <div className="flex-1 p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold tracking-wide text-sky-800 dark:text-sky-300">
                        AIR TICKET
                      </h2>
                      <p className="text-sm font-medium text-muted-foreground">
                        {getAirlineName(details.flight_name || details.flightname)}
                      </p>
                    </div>
                    {getAirlineLogo(details.flight_name || details.flightname) && (
                      <img
                        src={
                          getAirlineLogo(details.flight_name || details.flightname) ||
                          ""
                        }
                        alt="Logo"
                        className="h-12 w-auto object-contain"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        Passenger
                      </p>
                      <p className="font-bold text-lg">
                        {details.passenger_name || details.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        Nationality
                      </p>
                      <p className="font-bold text-lg">{details.nationality}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        From
                      </p>
                      <p className="font-bold text-lg">
                        {details.source || details.src}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        To
                      </p>
                      <p className="font-bold text-lg">
                        {details.destination || details.des}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        Date
                      </p>
                      <p className="font-bold text-lg">
                        {details.formatted_date || details.ddate || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground font-semibold">
                        Flight
                      </p>
                      <p className="font-bold text-lg">
                        {details.flight_name || details.flightname}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-dashed border-slate-400 text-sm text-muted-foreground">
                    <p>PNR: <span className="font-semibold">{details.PNR}</span> | Ticket: <span className="font-semibold">{details.TICKET}</span></p>
                  </div>
                </div>

                {/* Right section - small boarding pass stub */}
                <div className="md:w-64 bg-sky-300/30 dark:bg-slate-800/70 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-sky-900 dark:text-sky-200">
                      BOARDING PASS
                    </h3>
                    <div className="text-sm space-y-2">
                      <p><span className="font-semibold">Name:</span> {details.passenger_name || details.name}</p>
                      <p><span className="font-semibold">From:</span> {details.source || details.src}</p>
                      <p><span className="font-semibold">To:</span> {details.destination || details.des}</p>
                      <p><span className="font-semibold">Date:</span> {details.formatted_date || details.ddate || "N/A"}</p>
                      <p><span className="font-semibold">Flight:</span> {details.flight_name || details.flightname}</p>
                    </div>
                  </div>
                  <div className="mt-6 h-8 bg-slate-800/60 rounded barcode-pattern"></div>
                </div>
              </div>
            </div>
          )}

          {!details && !loading && (
            <Card className="rounded-2xl p-12 text-center text-muted-foreground shadow-md">
              <Plane className="w-12 h-12 mx-auto mb-3 opacity-70" />
              <p className="text-lg font-semibold mb-1">No Boarding Pass Yet</p>
              <p className="text-sm">
                Enter your PNR number above to view your boarding pass.
              </p>
            </Card>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default BoardingPass;
