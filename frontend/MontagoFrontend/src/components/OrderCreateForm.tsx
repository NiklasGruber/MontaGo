import * as React from "react";
import { useEffect, useState } from "react";
import { ProductDto, OrderDto } from "../api/types";
import addressApi from "../api/addressApi";
import customerApi from "../api/customerApi";
import orderTypesApi from "../api/orderTypeApi";
import employeeApi from "../api/employeeApi";
import productApi from "../api/productApi";
import orderApi from "../api/orderApi";

interface OrderCreateFormProps {
  onCreated?: () => void;
  order?: OrderDto;
}

const OrderCreateForm: React.FC<OrderCreateFormProps> = ({ onCreated, order }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orderTypes, setOrderTypes] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);

  const [orderState, setOrder] = useState({
    name: order?.name ?? "",
    startDate: order?.startDate ?? "",
    dueDate: order?.dueDate ?? "",
    customerId: order?.customerId ?? 0,
    orderTypeId: order?.orderTypeId ?? 0,
    billingAddressId: order?.billingAddressId ?? 0,
    deliveryAddressId: order?.deliveryAddressId ?? 0,
    productIds: order?.productIds ?? [],
    workerIds: order?.assignedWorkerIds ?? [],
  });

  const [selectedProductsWithPrice, setSelectedProductsWithPrice] = useState<
    { productId: number; price: number }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const [c, a, o, w, p] = await Promise.all([
        customerApi.fetchCustomers(),
        addressApi.fetchAddresses(),
        orderTypesApi.fetchOrderTypes(),
        employeeApi.fetchEmployees(),
        productApi.fetchProducts(),
      ]);

      console.log("Geladene Daten:", {
        customers: c,
        addresses: a,
        orderTypes: o,
        workers: w,
        products: p,
      });

      setCustomers(c);
      setAddresses(a);
      setOrderTypes(o);
      setWorkers(w);
      setProducts(p);

      if (c.length > 0) {
        setOrder((prev) => ({ ...prev, customerId: c[0].id }));
      }
      if (o.length > 0) {
        setOrder((prev) => ({ ...prev, orderTypeId: o[0].id }));
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

    // Ensure dates are always ISO strings

  const minValue = "0001-01-01T00:00:00Z";
    const startDate = orderState.startDate ? new Date(orderState.startDate).toISOString() : minValue;
    const dueDate = orderState.dueDate ? new Date(orderState.dueDate).toISOString() : minValue;
    const endDate = dueDate;

    console.log(`StartDate: ${startDate}`);
    console.log(`DueDate: ${dueDate}`);

    const payload = {
      name: orderState.name,
      customerId: orderState.customerId,
      orderTypeId: orderState.orderTypeId,
      billingAddressId: orderState.billingAddressId,
      deliveryAddressId: orderState.deliveryAddressId,
      productIds: productIds.length > 0 ? productIds : [0],
      workerIds: orderState.workerIds.length > 0 ? orderState.workerIds : [0],
      startDate,
      dueDate,
      endDate,
    };

    console.log("Sende Order-Payload:", payload);

    try {
      await orderApi.postOrder(payload);
      onCreated?.();
      alert("Termine erfolgreich erstellt.");
    } catch (err) {
      console.error("Fehler beim Erstellen der Termine", err);
      alert("Fehler beim Erstellen der Termine.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-primary">Neue Termine</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          type="text"
          placeholder="Auftragsname"
          value={orderState.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="customerId"
          value={orderState.customerId}
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
          value={orderState.orderTypeId}
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
          value={orderState.billingAddressId}
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
          value={orderState.deliveryAddressId ?? 0}
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

      <input
        name="startDate"
        type="date"
        value={orderState.startDate}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="dueDate"
        type="date"
        value={orderState.dueDate}
        onChange={handleChange}
        className="border p-2 rounded"
      />

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
                checked={orderState.workerIds.includes(w.id)}
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
          Termine erstellen
        </button>
      </div>
    </div>
  );
};

export default OrderCreateForm;
