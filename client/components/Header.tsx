import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Menu, X } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="bg-gradient-to-br from-primary to-emerald-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">NOUVELLE ACADEMY</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-600 hover:text-primary font-medium transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="text-slate-600 hover:text-primary font-medium transition"
          >
            Progress
          </button>
          <button
            onClick={() => navigate("/sessions")}
            className="text-slate-600 hover:text-primary font-medium transition"
          >
            Live Sessions
          </button>
        </nav>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-slate-500 text-xs">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/progress");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Progress
            </button>
            <button
              onClick={() => {
                navigate("/sessions");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Live Sessions
            </button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full gap-2 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
