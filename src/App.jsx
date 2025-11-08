import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import muiTheme, { muiDarkTheme } from "./theme/muiTheme";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import GenerateMahostav from "./pages/GenerateMahostav";
import Sports from "./pages/Sports";
import Cultural from "./pages/Cultural";
import MyRegistrations from "./pages/MyRegistrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? muiDarkTheme : muiTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate-mahostav" element={<GenerateMahostav />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/cultural" element={<Cultural />} />
              <Route path="/my-registrations" element={<MyRegistrations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
