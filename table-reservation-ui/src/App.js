import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import KOTScreen from "./pages/KOTScreen";
import "./index.css";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <div className="content-container">
        {/* Conditionally render Sidebar */}
        {location.pathname !== "/" && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/kot" element={<KOTScreen />} />

            {/* Orders Page */}
            <Route path="/orders" element={<OrdersPage />} />

            {/* Order Details Page */}
            <Route path="/orders/:id" element={<OrderDetailsPage />} />

            {/* Default route */}
            <Route path="/" element={<ItemsPage />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

