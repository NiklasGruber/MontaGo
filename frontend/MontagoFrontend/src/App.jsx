import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeesPage from "./components/Employees";
import LoginPage from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderList from "./components/OrderList";
import RolePage from "./components/Role";
import CustomerPage from "./components/Customers";
import AddressPage from "./components/AddressPage";
import OrderItemPage from "./components/OrderItemPage";
import OrderTypePage from "./components/OrderTypePage";


function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/roles" element={<RolePage />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/customers" element={<CustomerPage />} />
                    <Route path="/addresses" element={<AddressPage />} />
                    <Route path="/order-items" element={<OrderItemPage />} />
                    <Route path="/order-types" element={<OrderTypePage />} />

                    {/* Add more protected pages here */}
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
