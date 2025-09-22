import { api } from "@/shared/api/axios";
import { TTask } from "./types";

export const fetchTasks = async (): Promise<TTask[]> => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (payload: {
  body: string;
  priority: number;
}): Promise<TTask> => {
  const response = await api.post("/task/create", payload);
  return response.data;
};

export const editTask = async (
  id: number,
  completed: boolean
): Promise<TTask> => {
  const response = await api.patch(`/task/edit/${id}` , { completed });
  return response.data;
};

