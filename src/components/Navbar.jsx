import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            MAHOSTAV 2026
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/sports" className="hover:text-primary transition-colors">
                  Sports
                </Link>
                <Link to="/cultural" className="hover:text-primary transition-colors">
                  Cultural
                </Link>
                <Link to="/my-registrations" className="hover:text-primary transition-colors">
                  My Registrations
                </Link>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signin">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/sports"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sports
                </Link>
                <Link
                  to="/cultural"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cultural
                </Link>
                <Link
                  to="/my-registrations"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Registrations
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
