import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { ProductDto } from "../api/types";

const OrderCreateForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orderTypes, setOrderTypes] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);

  const [order, setOrder] = useState({
    customerId: 0,
    orderTypeId: 0,
    billingAddressId: 0,
    deliveryAddressId: 0,
    productIds: [] as number[],
    workerIds: [] as number[],
  });

  const [selectedProductsWithPrice, setSelectedProductsWithPrice] = useState<
    { productId: number; price: number }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const [c, a, o, w, p] = await Promise.all([
        authAxios.get("/Customer"),
        authAxios.get("/Address"),
        authAxios.get("/OrderType"),
        authAxios.get("/Worker"),
        authAxios.get("/Product"),
      ]);
      setCustomers(c.data);
      setAddresses(a.data);
      setOrderTypes(o.data);
      setWorkers(w.data);
      setProducts(p.data);

      if (c.data.length > 0) {
        setOrder((prev) => ({ ...prev, customerId: c.data[0].id }));
      }
      if (o.data.length > 0) {
        setOrder((prev) => ({ ...prev, orderTypeId: o.data[0].id }));
      }
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

  const toggleWorker = (id: number) => {
    setOrder((prev) => ({
      ...prev,
      workerIds: prev.workerIds.includes(id)
        ? prev.workerIds.filter((x) => x !== id)
        : [...prev.workerIds, id],
    }));
  };

  const handleSubmit = async () => {
    const productIds = selectedProductsWithPrice.map((x) => x.productId);
    const payload = { ...order, productIds };

    console.log("Sende Bestellung:", payload); // 🔍 Debug-Ausgabe

    try {
      await authAxios.post("/Orders", payload);
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
        <h3 className="font-semibold text-sm mb-1">📦 Produkte mit Preis</h3>
        <div className="grid grid-cols-1 gap-3 text-sm">
          {products.map((product) => {
            const entry = selectedProductsWithPrice.find((x) => x.productId === product.id);
            return (
              <div key={product.id} className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!entry}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProductsWithPrice((prev) => [
                          ...prev,
                          { productId: product.id, price: 0 },
                        ]);
                      } else {
                        setSelectedProductsWithPrice((prev) =>
                          prev.filter((x) => x.productId !== product.id)
                        );
                      }
                    }}
                  />
                  {product.name}
                </label>

                {entry && (
                  <input
                    type="number"
                    min={0}
                    placeholder="Preis"
                    className="border p-1 rounded w-32"
                    value={entry.price}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value);
                      setSelectedProductsWithPrice((prev) =>
                        prev.map((x) =>
                          x.productId === product.id ? { ...x, price: newPrice } : x
                        )
                      );
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-sm mb-1">👷 Mitarbeiter zuweisen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {workers.map((w) => (
            <label key={w.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={order.workerIds.includes(w.id)}
                onChange={() => toggleWorker(w.id)}
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
