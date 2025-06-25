import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import OrderCreateForm from "./OrderCreateForm";
import { OrderDto, CustomerDto } from "../api/types";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [orderTypes, setOrderTypes] = useState<any[]>([]);
  const [filterCustomerId, setFilterCustomerId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "customer">("date");
  const [editingOrder, setEditingOrder] = useState<OrderDto | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await authAxios.get<OrderDto[]>("/Orders");
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Fehler beim Laden der Bestellungen");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderTypes = async () => {
    try {
      const response = await authAxios.get("/OrderType");
      setOrderTypes(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Auftragstypen", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await authAxios.get<CustomerDto[]>("/Customer");
      setCustomers(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Kunden", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchOrderTypes();
  }, []);

  const getOrderTypeName = (orderTypeId: number) => {
    return orderTypes.find((t) => t.id === orderTypeId)?.name ?? `#${orderTypeId}`;
  };

  const getCustomerName = (customerId: number) => {
    return customers.find((c) => c.id === customerId)?.companyName ?? `#${customerId}`;
  };

  const deleteOrder = async (orderId: number) => {
    if (!window.confirm("Bist du sicher, dass du diese Bestellung löschen willst?")) return;
    
    console.log("Lösche Bestellung mit ID:", orderId); // Debug-Ausgabe

    try {
      await authAxios.delete(`/Orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error("Fehler beim Löschen der Bestellung", err);
      alert("Löschen fehlgeschlagen.");
    }
  };

  // Filter & Sortierung
  let displayedOrders = [...orders];
  if (filterCustomerId) {
    displayedOrders = displayedOrders.filter((o) => o.customerId === filterCustomerId);
  }
  if (sortBy === "date") {
    displayedOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === "customer") {
    displayedOrders.sort((a, b) => a.customerId - b.customerId);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Bestellungen</h2>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditingOrder(null);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          {showForm ? "Abbrechen" : "+ Neue Bestellung"}
        </button>
      </div>

      {(showForm || editingOrder) && (
        <div className="mb-6">
          <OrderCreateForm
            order={editingOrder || undefined}
            onCreated={() => {
              fetchOrders();
              setShowForm(false);
              setEditingOrder(null);
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          className="border p-2 rounded"
          value={filterCustomerId ?? 0}
          onChange={(e) => setFilterCustomerId(Number(e.target.value) || null)}
        >
          <option value={0}>Alle Kunden</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.companyName}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "customer")}
        >
          <option value="date">Sortieren nach: Datum</option>
          <option value="customer">Sortieren nach: Kunde</option>
        </select>
      </div>

      {loading ? (
        <p>Lade Bestellungen…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedOrders.length === 0 ? (
        <p className="text-gray-500">Keine Bestellungen gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {displayedOrders.map((order) => (
            <li
              key={order.id}
              className="p-4 bg-white shadow rounded border border-neutral"
            >
              <p className="text-sm text-gray-700">📄 Bestellung #{order.name}</p>
              <p className="text-xs text-gray-500">
                Kunde: {getCustomerName(order.customerId)}, Typ: {getOrderTypeName(order.orderTypeId)}
              </p>
              <p className="text-xs text-gray-400">
                Erstellt: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                ⏱️ {order.startDate ? new Date(order.startDate).toLocaleDateString() : "?"} →{" "}
                {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : "?"}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditingOrder(order)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;
