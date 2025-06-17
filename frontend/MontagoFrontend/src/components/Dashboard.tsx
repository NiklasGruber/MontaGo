import React from "react";

const Dashboard: React.FC = () => {
  const activeOrders = ["Auftrag 1", "Auftrag 2", "Auftrag 3"];
  const openOrders = ["Auftrag 1", "Auftrag 2", "Auftrag 3"];

  return (
    <div className="flex bg-background min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-primary mb-6">Dashboard</h1>

        {/* Kalender Platzhalter */}
        <div className="bg-white rounded shadow p-4 mb-6 h-64">
          <h2 className="font-semibold mb-2">Kalender (z.B. Monatsübersicht)</h2>
          <div className="text-sm text-gray-400">[Kalender-Komponente kommt hier hin]</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold text-neutral mb-3">Active</h2>
            <ul className="list-disc list-inside">
              {activeOrders.map((order, i) => (
                <li key={i} className="text-neutral">{order}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold text-neutral mb-3">Open</h2>
            <ul className="list-disc list-inside">
              {openOrders.map((order, i) => (
                <li key={i} className="text-neutral">{order}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
