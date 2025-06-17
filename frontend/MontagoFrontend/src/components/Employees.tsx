import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { EmployeeDto } from "../api/types"; // Adjust the import path as 

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await authAxios.get<EmployeeDto[]>("http://[::1]/api/Worker");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Mitarbeiterübersicht</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded shadow border border-neutral">
            <h2 className="text-lg font-semibold text-neutral">
              {emp.firstName} {emp.lastName}
            </h2>
            <p className="text-sm text-gray-600">📧 {emp.email}</p>
            <p className="text-sm text-gray-600">📞 {emp.phoneNumber}</p>
            <p className="text-sm text-gray-600">🧑 Rolle: {emp.role || "nicht zugewiesen"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
