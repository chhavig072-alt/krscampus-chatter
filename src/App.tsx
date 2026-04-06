import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { initializePosts } from "./data/seedData";
import { getUser } from "./utils/storage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import PageTransition from "./components/PageTransition";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import NotFound from "./pages/NotFound";

initializePosts();

function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-2">
            <SidebarTrigger />
            <span className="ml-3 text-sm font-semibold text-primary md:hidden">KRMU TALKS</span>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><AppLayout><PageTransition><Home /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><AppLayout><PageTransition><Explore /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><PageTransition><Profile /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><PageTransition><Notifications /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/communities" element={<ProtectedRoute><AppLayout><PageTransition><Communities /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/communities/:id" element={<ProtectedRoute><AppLayout><PageTransition><CommunityDetail /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
