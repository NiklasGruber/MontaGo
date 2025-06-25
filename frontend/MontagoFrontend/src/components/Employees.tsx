import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { EmployeeDto, RoleDto } from "../api/types";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newEmployee, setNewEmployee] = useState<EmployeeDto>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: 0,
  });

  const fetchEmployees = async () => {
    try {
      const response = await authAxios.get<EmployeeDto[]>("/Worker");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await authAxios.get<RoleDto[]>("/Role");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await authAxios.put(`/Worker/${newEmployee.id}`, newEmployee);
      } else {
        await authAxios.post("/Worker", newEmployee);
      }
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Failed to save employee", error);
    }
  };

  const handleEdit = (employee: EmployeeDto) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Mitarbeiter wirklich löschen?")) return;
    try {
      await authAxios.delete(`/Worker/${id}`);
      console.log(id, "deleted");
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setNewEmployee({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleId: 0,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Mitarbeiterübersicht</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Neuer Mitarbeiter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded shadow border border-neutral relative">
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(emp)} title="Bearbeiten">
                ✏️
              </button>
              <button onClick={() => handleDelete(emp.id)} title="Löschen">
                🗑️
              </button>
            </div>
            <h2 className="text-lg font-semibold text-neutral">
              {emp.firstName} {emp.lastName}
            </h2>
            <p className="text-sm text-gray-600">📧 {emp.email}</p>
            <p className="text-sm text-gray-600">📞 {emp.phoneNumber}</p>
            <p className="text-sm text-gray-600">
              🧑 Rolle: {roles.find((role) => role.id === emp.roleId)?.name || "Unbekannt"}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">
              {isEditing ? "Mitarbeiter bearbeiten" : "Neuer Mitarbeiter"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                name="firstName"
                placeholder="Vorname"
                className="w-full border p-2 rounded"
                value={newEmployee.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nachname"
                className="w-full border p-2 rounded"
                value={newEmployee.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                className="w-full border p-2 rounded"
                value={newEmployee.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Telefonnummer"
                className="w-full border p-2 rounded"
                value={newEmployee.phoneNumber}
                onChange={handleChange}
              />
              <select
                name="roleId"
                className="w-full border p-2 rounded"
                value={newEmployee.roleId}
                onChange={handleChange}
              >
                <option value={0}>Rolle auswählen</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-neutral rounded hover:bg-gray-400"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-accent"
              >
                {isEditing ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
