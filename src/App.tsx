import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { initializePosts } from "./data/seedData";
import { getUser } from "./utils/storage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

initializePosts();

function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
