import authAxios from "./axios";
import { OrderDto } from "./types";

export const getOrders = async (): Promise<OrderDto[]> => {
  const response = await authAxios.get<OrderDto[]>("/Orders");
  return response.data;
};
