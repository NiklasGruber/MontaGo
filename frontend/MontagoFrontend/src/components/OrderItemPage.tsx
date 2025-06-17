import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { OrderItemDto } from "../api/types";

const OrderItemPage: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItemDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItemDto>({
    productName: "",
    quantity: 1,
  });

  const fetchItems = async () => {
    try {
      const response = await authAxios.get<OrderItemDto[]>("/OrderItem");
      setOrderItems(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der OrderItems", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedItem.id !== undefined) {
        await authAxios.put(`/OrderItem/${selectedItem.id}`, selectedItem);
      } else {
        await authAxios.post("/OrderItem", selectedItem);
      }
      setShowModal(false);
      setSelectedItem({ productName: "", quantity: 1 });
      setIsEditing(false);
      fetchItems();
    } catch (err) {
      console.error("Fehler beim Speichern", err);
    }
  };

  const handleEdit = (item: OrderItemDto) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Wirklich löschen?")) return;
    try {
      await authAxios.delete(`/OrderItem/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Fehler beim Löschen", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Produkte (OrderItems)</h1>
        <button
          onClick={() => {
            setSelectedItem({ productName: "", quantity: 1 });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          + Neues Produkt
        </button>
      </div>

      <ul className="space-y-2">
        {orderItems.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(item)} title="Bearbeiten">✏️</button>
              <button onClick={() => handleDelete(item.id)} title="Löschen">🗑️</button>
            </div>
            <p className="text-sm font-medium text-neutral">{item.productName}</p>
            <p className="text-xs text-gray-500">Menge: {item.quantity}</p>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Produkt bearbeiten" : "Neues Produkt"}
            </h2>

            <input
              type="text"
              name="productName"
              placeholder="Produktname"
              value={selectedItem.productName}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="number"
              name="quantity"
              min={1}
              value={selectedItem.quantity}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-neutral px-4 py-2 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
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

export default OrderItemPage;
