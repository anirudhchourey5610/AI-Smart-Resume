import axios from "axios";
import { apiUrl } from "../config/api";

export async function login(email, password) {
  const response = await axios.post(apiUrl("/api/auth/login"), { email, password });
  return response.data;
}

export async function register(username, email, password) {
  const response = await axios.post(apiUrl("/api/auth/register"), {
    username,
    email,
    password,
  });
  return response.data;
}