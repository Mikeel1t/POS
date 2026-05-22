import client from "./api";

export const login = async (username: string, password: string) => {
  const { data } = await client.post("/auth/login", { username, password });
  return data as { access_token: string; token_type: string };
};

export const register = async (username: string, email: string, password: string) => {
  const { data } = await client.post("/auth/register", { username, email, password });
  return data;
};