import { getEnvironments } from "@/features/getEnvironments/getEnvironments";
import { BASE_URL } from "./constants";

export const GET_ENVIRONMENTS_ENDPOINT = BASE_URL + "/environment"
export const GET_ENVIRONMENTS_BY_ID_ENDPOINT = (id: string) => `${BASE_URL}/environment/${id}`
