import * as React from "react";
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import { EventReceiveArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import authAxios from "../api/axios";
import "../styles/calendar.css";
import { OrderDto } from "../api/types";

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await authAxios.get("/Orders");
      setOrders(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Termine", err);
    }
  };

  useEffect(() => {
    const externalContainer = document.getElementById("external-orders");
    if (externalContainer) {
      new Draggable(externalContainer, {
        itemSelector: ".fc-draggable-order",
        eventData: function (el) {
          const id = el.getAttribute("data-id");
          const title = el.getAttribute("data-title");
          return {
            id: id!,
            title: title!,
            duration: { days: 1 },
          };
        },
      });
    }
  }, [orders]);

  const activeOrders = orders.filter((o) => o.active);
  const openOrders = orders.filter((o) => !o.active);

  const handleEventClick = (info: EventClickArg) => {
    const order = orders.find((o) => o.id === parseInt(info.event.id));
    if (order) setSelectedOrder(order);
  };

const isProcessing = useRef<boolean>(false);

const handleReceive = async (info: EventReceiveArg) => {
  if (isProcessing.current) return;
  isProcessing.current = true;

  try {
    const id = parseInt(info.event.id);
    const dropDate = info.event.start!;
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const startDate = dropDate.toISOString();
    const dueDate = new Date(dropDate.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const updated: OrderDto = {
      ...order,
      startDate,
      dueDate,
      endDate: dueDate,
    };

    await authAxios.put(`/Orders/${id}`, updated);
    await fetchOrders();
    setCalendarKey((prev) => prev + 1);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Termine", err);
  } finally {
    isProcessing.current = false;
  }
};



  const calendarEvents = orders
    .filter((o) => o.startDate && o.dueDate)
    .map((o) => ({
      id: String(o.id),
      title: o.name,
      start: o.startDate!,
      end: o.dueDate!,
      color: o.active ? "#34d399" : "#facc15",
      allDay: true,
    }));

    const handleResize = async (info: any) => {
  const id = parseInt(info.event.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return;

  const newStartDate = info.event.start?.toISOString();
  const newDueDate = info.event.end?.toISOString();

  const updated: OrderDto = {
    ...order,
    startDate: newStartDate,
    dueDate: newDueDate,
    endDate: newDueDate,
  };

  try {
    await authAxios.put(`/Orders/${id}`, updated);
    await fetchOrders();
    setCalendarKey((prev) => prev + 1);
  } catch (err) {
    console.error("Fehler beim Anpassen der Termine per Resize", err);
  }
};

const handleDrop = async (info: any) => {
  const id = parseInt(info.event.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return;

  const newStartDate = info.event.start?.toISOString();
  const newDueDate = info.event.end?.toISOString();

  const updated: OrderDto = {
    ...order,
    startDate: newStartDate,
    dueDate: newDueDate,
    endDate: newDueDate,
  };

  try {
    await authAxios.put(`/Orders/${id}`, updated);
    await fetchOrders();
    setCalendarKey((prev) => prev + 1);
  } catch (err) {
    console.error("Fehler beim Verschieben der Termine", err);
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">📆 Kalender</h1>

      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        editable={true}
        droppable={true}
        eventReceive={handleReceive}
        eventResize={handleResize}  
        eventDrop={handleDrop}
        eventClick={handleEventClick}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
      />

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-2">
              Termine #{selectedOrder.id}
            </h2>
            <p className="text-sm font-medium mb-1">{selectedOrder.name}</p>
            <p className="text-sm text-gray-600">
              Zeitraum:{" "}
              {selectedOrder.startDate
                ? new Date(selectedOrder.startDate).toLocaleDateString()
                : "—"}{" "}
              →{" "}
              {selectedOrder.dueDate
                ? new Date(selectedOrder.dueDate).toLocaleDateString()
                : "—"}
            </p>
            <p className="text-sm text-gray-600">
              Status: {selectedOrder.active ? "🟢 Aktiv" : "🟡 Offen"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">🟢 Aktive Termine</h2>
          <ul className="space-y-2">
            {activeOrders.map((o) => (
              <li
                key={o.id}
                className="p-3 bg-white shadow rounded border border-green-500"
              >
                <p className="font-medium text-sm text-neutral">
                  #{o.id} – {o.name}
                </p>
                <p className="text-xs text-gray-500">
                  {o.startDate
                    ? `${new Date(o.startDate).toLocaleDateString()} → ${new Date(
                        o.dueDate!
                      ).toLocaleDateString()}`
                    : "Noch nicht geplant"}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">🟡 Offene Termine</h2>
          <ul className="space-y-2" id="external-orders">
            {openOrders.map((o) => (
              <li
                key={o.id}
                className="p-3 bg-white shadow rounded border border-yellow-400 fc-draggable-order cursor-move"
                data-id={o.id}
                data-title={`#${o.id} – ${o.name}`}
              >
                <p className="font-medium text-sm text-neutral">
                  #{o.id} – {o.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
