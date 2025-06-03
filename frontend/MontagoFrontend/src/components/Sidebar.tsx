import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-primary text-white w-64 min-h-screen p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">MontaGo</h2>
      <nav className="flex flex-col gap-2">
        <a href="#" className="hover:text-accent">Dashboard</a>
        <a href="#" className="hover:text-accent">Orders</a>
        <a href="#" className="hover:text-accent">Employees</a>
        <a href="#" className="hover:text-accent">Customers</a>
        <a href="#" className="hover:text-accent">Settings</a>
        <a href="#" className="hover:text-accent">Profile</a>
        <a href="#" className="hover:text-accent mt-auto">Logout</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
