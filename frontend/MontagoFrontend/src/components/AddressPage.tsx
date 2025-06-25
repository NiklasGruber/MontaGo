import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { AddressDto } from "../api/types";

const AddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressDto>({
    id: 0,
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    additionalInfo: "",
  });

  const fetchAddresses = async () => {
    try {
      const response = await authAxios.get<AddressDto[]>("/Address");
      setAddresses(response.data);
    } catch (error) {
      console.error("Error loading addresses", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setSelectedAddress({
      id: 0,
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      country: "",
      additionalInfo: "",
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await authAxios.put(`/Address/${selectedAddress.id}`, selectedAddress);
      } else {
        await authAxios.post("/Address", selectedAddress);
      }
      setShowModal(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("Fehler beim Speichern der Adresse", error);
    }
  };

  const handleEdit = (addr: AddressDto) => {
    setSelectedAddress(addr);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Adresse wirklich löschen?")) return;
    try {
      await authAxios.delete(`/Address/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error("Fehler beim Löschen", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Adressenverwaltung</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Neue Adresse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white p-4 rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(addr)} title="Bearbeiten">✏️</button>
              <button onClick={() => handleDelete(addr.id)} title="Löschen">🗑️</button>
            </div>
            <h2 className="text-md font-semibold text-neutral">
              {addr.street} {addr.houseNumber}
            </h2>
            <p className="text-sm text-gray-600">
              {addr.postalCode} {addr.city}, {addr.country}
            </p>
            {addr.additionalInfo && (
              <p className="text-sm text-gray-400 italic">{addr.additionalInfo}</p>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-primary mb-4">
              {isEditing ? "Adresse bearbeiten" : "Neue Adresse"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <input name="street" placeholder="Straße" className="border p-2 rounded" value={selectedAddress.street} onChange={handleChange} />
              <input name="houseNumber" placeholder="Hausnummer" className="border p-2 rounded" value={selectedAddress.houseNumber} onChange={handleChange} />
              <input name="postalCode" placeholder="PLZ" className="border p-2 rounded" value={selectedAddress.postalCode} onChange={handleChange} />
              <input name="city" placeholder="Ort" className="border p-2 rounded" value={selectedAddress.city} onChange={handleChange} />
              <input name="country" placeholder="Land" className="border p-2 rounded" value={selectedAddress.country} onChange={handleChange} />
              <input name="additionalInfo" placeholder="Zusatzinfo (optional)" className="border p-2 rounded" value={selectedAddress.additionalInfo} onChange={handleChange} />
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

export default AddressPage;
