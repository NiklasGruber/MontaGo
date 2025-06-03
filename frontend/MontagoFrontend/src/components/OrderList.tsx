import React, { useEffect, useState } from "react";
import { getOrders} from "../api/orders";
import type { OrderDto } from "../api/types";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>{order.customerName} – {new Date(order.createdAt).toLocaleDateString()}</li>
      ))}
    </ul>
  );
};

export default OrderList;
