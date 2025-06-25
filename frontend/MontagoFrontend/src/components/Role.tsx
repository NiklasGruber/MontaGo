import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { RoleDto } from "../api/types";

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDto>({ id: 0, name: "" });

  const fetchRoles = async () => {
    try {
      const response = await authAxios.get<RoleDto[]>("/api/Role");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const resetForm = () => {
    setSelectedRole({ id: 0, name: "" });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole({ ...selectedRole, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await authAxios.put(`/api/Role/${selectedRole.id}`, selectedRole);
      } else {
        await authAxios.post("/api/Role", selectedRole);
      }
      setShowModal(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      console.error("Fehler beim Speichern der Rolle", error);
    }
  };

  const handleEdit = (role: RoleDto) => {
    setSelectedRole(role);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Möchtest du diese Rolle wirklich löschen?")) return;
    try {
      await authAxios.delete(`/Role/${id}`);
      fetchRoles();
    } catch (error) {
      console.error("Fehler beim Löschen", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Rollenverwaltung</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Neue Rolle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white p-4 rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(role)} title="Bearbeiten">
                ✏️
              </button>
              <button onClick={() => handleDelete(role.id)} title="Löschen">
                🗑️
              </button>
            </div>
            <h2 className="text-lg font-semibold text-neutral">{role.name}</h2>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">
              {isEditing ? "Rolle bearbeiten" : "Neue Rolle"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Rollenname"
              className="w-full border p-2 rounded"
              value={selectedRole.name}
              onChange={handleChange}
            />
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

export default RolePage;
