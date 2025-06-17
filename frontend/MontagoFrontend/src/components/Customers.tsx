import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { CustomerDto, AddressDto } from "../api/types";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto>({
    id: 0,
    companyName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    addressId: 0,
  });

  const [newAddress, setNewAddress] = useState<AddressDto>({
    id: 0,
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    additionalInfo: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await authAxios.get<CustomerDto[]>("/Customer");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await authAxios.get<AddressDto[]>("/Address");
      setAddresses(response.data);
    } catch (error) {
      console.error("Error loading addresses", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setSelectedCustomer({
      id: 0,
      companyName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      addressId: 0,
    });
    setNewAddress({
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

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({
      ...prev,
      [name]: name === "addressId" ? Number(value) : value,
    }));
  };
  
  

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await authAxios.put(`/Customer/${selectedCustomer.id}`, selectedCustomer);
      } else {
        await authAxios.post("/Customer", selectedCustomer);
      }
      setShowModal(false);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Fehler beim Speichern des Kunden", error);
    }
  };

  const handleEdit = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Kunden wirklich löschen?")) return;
    try {
      await authAxios.delete(`/Customer/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Fehler beim Löschen", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await authAxios.post<AddressDto>("/Address", newAddress);
      const added = response.data;
      setAddresses((prev) => [...prev, added]);
      setSelectedCustomer((prev) => ({ ...prev, addressId: added.id  }));
      setNewAddress({
        id: 0,
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
        country: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Adresse konnte nicht erstellt werden", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Kundenverwaltung</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          Neuer Kunde
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white p-4 rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(customer)} title="Bearbeiten">✏️</button>
              <button onClick={() => handleDelete(customer.id)} title="Löschen">🗑️</button>
            </div>
            <h2 className="text-lg font-semibold text-neutral">{customer.companyName}</h2>
            <p className="text-sm text-gray-600">👤 {customer.contactPerson}</p>
            <p className="text-sm text-gray-600">📧 {customer.email}</p>
            <p className="text-sm text-gray-600">📞 {customer.phoneNumber}</p>
            <p className="text-sm text-gray-600">
  📍 Adresse:{" "}
  {(() => {
    const addr = addresses.find((a) => a.id === customer.addressId);
    return addr ? `${addr.street} ${addr.houseNumber}` : "–";
  })()}
</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold text-primary mb-4">
              {isEditing ? "Kunde bearbeiten" : "Neuer Kunde"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="companyName"
                placeholder="Firma"
                className="border p-2 rounded w-full"
                value={selectedCustomer.companyName}
                onChange={handleCustomerChange}
              />
              <input
                name="contactPerson"
                placeholder="Ansprechpartner"
                className="border p-2 rounded w-full"
                value={selectedCustomer.contactPerson}
                onChange={handleCustomerChange}
              />
              <input
                name="email"
                placeholder="E-Mail"
                className="border p-2 rounded w-full"
                value={selectedCustomer.email}
                onChange={handleCustomerChange}
              />
              <input
                name="phoneNumber"
                placeholder="Telefonnummer"
                className="border p-2 rounded w-full"
                value={selectedCustomer.phoneNumber}
                onChange={handleCustomerChange}
              />

<select
  name="addressId"
  value={String(selectedCustomer.addressId ?? 0)}
  onChange={handleCustomerChange}
  className="border p-2 rounded w-full col-span-2"
>
  <option value="0">Adresse auswählen</option>
  {addresses
  .filter((addr) => typeof addr.id === "number" && addr.id > 0)
  .map((addr) => (
    <option key={`addr-${addr.id}`} value={String(addr.id)}>
      {addr.street} {addr.houseNumber}, {addr.city}
    </option>
))}

</select>

              <div className="col-span-2">
                <h3 className="text-md font-semibold mb-1">Neue Adresse hinzufügen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input name="street" placeholder="Straße" className="border p-2 rounded" value={newAddress.street} onChange={handleAddressChange} />
                  <input name="houseNumber" placeholder="Hausnummer" className="border p-2 rounded" value={newAddress.houseNumber} onChange={handleAddressChange} />
                  <input name="postalCode" placeholder="PLZ" className="border p-2 rounded" value={newAddress.postalCode} onChange={handleAddressChange} />
                  <input name="city" placeholder="Ort" className="border p-2 rounded" value={newAddress.city} onChange={handleAddressChange} />
                  <input name="country" placeholder="Land" className="border p-2 rounded" value={newAddress.country} onChange={handleAddressChange} />
                  <input name="additionalInfo" placeholder="Zusatzinfo" className="border p-2 rounded col-span-2" value={newAddress.additionalInfo} onChange={handleAddressChange} />
                </div>
                <button
                  onClick={handleAddAddress}
                  className="bg-primary text-white px-3 py-1 rounded hover:bg-accent"
                >
                  Adresse speichern
                </button>
              </div>
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

export default CustomerPage;
