import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { OrderTypeDto } from "../api/types";
import orderTypeApi from "../api/orderTypeApi";

const OrderTypePage: React.FC = () => {
  const [types, setTypes] = useState<OrderTypeDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<OrderTypeDto>({
    name: "",
    description: "",
    colorHex: "#34d399",
  });

  const fetchTypes = async () => {
    try {
      const res = await orderTypeApi.fetchOrderTypes();
      setTypes(res);
    } catch (err) {
      console.error("Fehler beim Laden der Auftragstypen", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEditing && selected.id !== undefined) {
        console.log(`Color: ${selected.colorHex}`);
        await orderTypeApi.putOrderType(selected);
      } else {
        console.log(`Color: ${selected.colorHex}`);
        await orderTypeApi.postOrderType(selected);
      }
      setShowModal(false);
      setSelected({ name: "", description: "", colorHex: "#34d399" });
      setIsEditing(false);
      fetchTypes();
    } catch (err) {
      console.error("Fehler beim Speichern", err);
    }
  };

  const handleEdit = (type: OrderTypeDto) => {
    setSelected({
      ...type,
      colorHex: type.colorHex ?? "#34d399",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Wirklich löschen?")) return;
    try {
      await orderTypeApi.deleteOrderType(id);
      fetchTypes();
    } catch (err) {
      console.error("Fehler beim Löschen", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Auftragstypen</h1>
        <button
          onClick={() => {
            setSelected({ name: "", description: "", colorHex: "#34d399" });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          + Neuer Typ
        </button>
      </div>

      <ul className="space-y-2">
        {types.map((type) => (
          <li
            key={type.id}
            className="p-4 bg-white rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(type)} title="Bearbeiten">
                ✏️
              </button>
              <button onClick={() => handleDelete(type.id)} title="Löschen">
                🗑️
              </button>
            </div>
            <p className="font-medium text-neutral flex items-center gap-2">
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  background: type.colorHex ?? "#34d399",
                  borderRadius: "4px",
                  marginRight: "6px",
                  border: "1px solid #ccc",
                }}
              ></span>
              {type.name}
            </p>
            <p className="text-sm text-gray-500">{type.description}</p>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Typ bearbeiten" : "Neuer Auftragstyp"}
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={selected.name}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <textarea
              name="description"
              placeholder="Beschreibung"
              value={selected.description}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <label className="block mb-2 font-medium">Farbe</label>
            <input
              type="color"
              name="colorHex"
              value={selected.colorHex ?? "#34d399"}
              onChange={handleChange}
              className="w-12 h-8 p-0 border-none mb-3 cursor-pointer"
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

export default OrderTypePage;