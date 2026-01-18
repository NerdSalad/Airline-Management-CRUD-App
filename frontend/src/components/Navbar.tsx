import { Moon, Sun, LogOut, Plane } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ✅ Handle title click to navigate to dashboard
  const handleTitleClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b shadow-elegant">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 👇 Make the entire title section clickable */}
        <button 
          onClick={handleTitleClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
        >
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Airline Management System
          </h1>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-primary/10"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;