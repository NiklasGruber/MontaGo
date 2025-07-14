import * as React from "react";
import { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { ProductDto } from "../api/types";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto>({
    id: 0,
    name: "",
    description: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await authAxios.get<ProductDto[]>("/api/Product");
      setProducts(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Produkte", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedProduct.id !== undefined) {
        await authAxios.put(`/api/Product/${selectedProduct.id}`, selectedProduct);
      } else {
        await authAxios.post("/api/Product", selectedProduct);
      }
      setShowModal(false);
      setSelectedProduct({id: 0, name: "", description: "" });
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      console.error("Fehler beim Speichern", err);
    }
  };

  const handleEdit = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Wirklich löschen?")) return;
    try {
      await authAxios.delete(`/api/Product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Fehler beim Löschen", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Produkte</h1>
        <button
          onClick={() => {
            setSelectedProduct({id:0, name: "", description: "" });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-accent"
        >
          + Neues Produkt
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white rounded shadow border border-neutral relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 text-sm">
              <button onClick={() => handleEdit(p)} title="Bearbeiten">✏️</button>
              <button onClick={() => handleDelete(p.id)} title="Löschen">🗑️</button>
            </div>
            <p className="text-sm font-medium text-neutral">{p.name}</p>
            <p className="text-xs text-gray-500">{p.description}</p>
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
              name="name"
              placeholder="Name"
              value={selectedProduct.name}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            />

            <textarea
              name="description"
              placeholder="Beschreibung"
              value={selectedProduct.description}
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

export default ProductPage;
