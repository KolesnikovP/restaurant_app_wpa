import { api } from "@/shared/api/axios";
import { TMenuItem } from "./types";

export const fetchMenuItems = async (): Promise<TMenuItem[]> => {
  const response = await api.get("/menu-items");
  return response.data;
};

export const createMenuItem = async (payload: {
  body: string;
  priority: number;
}): Promise<TMenuItem> => {
  const response = await api.post("/menu-item/create", payload);
  return response.data;
};

export const editMenuItem = async (
  id: number,
  completed: boolean
): Promise<TMenuItem> => {
  const response = await api.patch(`/menu-item/edit/${id}` , { completed });
  return response.data;
};
