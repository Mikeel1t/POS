import client from "./api";
import type { ReturnMovement } from "../types";

export const registerReturn = async (payload: ReturnMovement) => {
  const { data } = await client.post("/returns", payload);
  return data;
};