import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Flights from "./pages/Flights";
import Passengers from "./pages/Passengers";
import Reservations from "./pages/Reservations";
import Cancellations from "./pages/Cancellations";
import BookFlight from "./pages/BookFlight";
import BoardingPass from "./pages/BoardingPass";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flights"
              element={
                <ProtectedRoute>
                  <Flights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passengers"
              element={
                <ProtectedRoute>
                  <Passengers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cancellations"
              element={
                <ProtectedRoute>
                  <Cancellations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-flight"
              element={
                <ProtectedRoute>
                  <BookFlight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/boarding-pass"
              element={
                <ProtectedRoute>
                  <BoardingPass />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
