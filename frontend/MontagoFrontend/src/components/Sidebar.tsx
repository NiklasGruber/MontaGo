import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItemClass =
    "hover:text-accent transition-colors px-2 py-1 rounded block";
  const activeClass = "font-bold text-accent";

  return (
    <aside className="bg-primary text-white w-64 min-h-screen p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">MontaGo</h2>
      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Dashboard
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Orders
        </NavLink>
        <NavLink to="/order-items" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          OrderItems
        </NavLink>
          <NavLink to="/employees" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Employees
        </NavLink>
        <NavLink to="/roles" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Rolle
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Customers
        </NavLink>
        <NavLink to="/addresses" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Addresses
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Settings
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${navItemClass} ${activeClass}` : navItemClass}>
          Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="text-white hover:text-accent transition px-2 py-1 mt-auto text-left"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
