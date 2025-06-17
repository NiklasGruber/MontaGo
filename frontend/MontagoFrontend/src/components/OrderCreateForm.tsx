import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";

interface OrderDto {
  customerId: number;
  orderTypeId: number;
  billingAddressId: number;
  deliveryAddressId: number;
  itemsId: number[];
  assignedWorkerIds: number[];
  createdAt: string;
}

const OrderCreateForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orderTypes, setOrderTypes] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [order, setOrder] = useState<OrderDto>({
    customerId: 0,
    orderTypeId: 0,
    billingAddressId: 0,
    deliveryAddressId: 0,
    itemsId: [],
    assignedWorkerIds: [],
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    const loadData = async () => {
      const [c, a, o, w, i] = await Promise.all([
        authAxios.get("/Customer"),
        authAxios.get("/Address"),
        authAxios.get("/OrderType"),
        authAxios.get("/Worker"),
        authAxios.get("/OrderItem"),
      ]);
      setCustomers(c.data);
      setAddresses(a.data);
      setOrderTypes(o.data);
      setWorkers(w.data);
      setItems(i.data);
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? parseInt(value) : value,
    }));
  };

  const toggleArrayValue = (field: "itemsId" | "assignedWorkerIds", id: number) => {
    setOrder((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((x) => x !== id)
        : [...prev[field], id],
    }));
  };

  const handleSubmit = async () => {
    try {
      await authAxios.post("/Orders", order);
      onCreated?.();
      alert("Bestellung erfolgreich erstellt.");
    } catch (err) {
      console.error("Fehler beim Erstellen der Bestellung", err);
      alert("Fehler beim Erstellen der Bestellung.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-primary">Neue Bestellung</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="customerId"
          value={order.customerId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={0}>Kunde wählen</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </select>

        <select
          name="orderTypeId"
          value={order.orderTypeId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={0}>Auftragstyp wählen</option>
          {orderTypes.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

        <select
          name="billingAddressId"
          value={order.billingAddressId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={0}>Rechnungsadresse wählen</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.street}, {a.city}
            </option>
          ))}
        </select>

        <select
          name="deliveryAddressId"
          value={order.deliveryAddressId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={0}>Lieferadresse wählen</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.street}, {a.city}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-sm mb-1">📦 Produkte auswählen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {items.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={order.itemsId.includes(item.id)}
                onChange={() => toggleArrayValue("itemsId", item.id)}
              />
              {item.productName}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-sm mb-1">👷 Mitarbeiter zuweisen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {workers.map((w) => (
            <label key={w.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={order.assignedWorkerIds.includes(w.id)}
                onChange={() => toggleArrayValue("assignedWorkerIds", w.id)}
              />
              {w.firstName} {w.lastName}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-accent"
        >
          Bestellung erstellen
        </button>
      </div>
    </div>
  );
};

export default OrderCreateForm;
