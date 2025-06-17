import React, { useEffect, useState } from "react";
import authAxios from "../api/axios";
import { OrderDto } from "../api/types"


const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authAxios.get<OrderDto[]>("/Orders");
        setOrders(response.data);
      } catch (err: any) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-neutral">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Orders</h2>
      <ul className="space-y-2">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            <p className="text-neutral font-semibold">
              {order.customerName || "Kein Kundenname"}
            </p>
            <p className="text-sm text-gray-500">
              Erstellt am: {new Date(order.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
