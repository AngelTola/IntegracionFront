// src/libs/authService.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Error en login");
  }

  return res.json();
}

export const backendip = () => {
  return BASE_URL;
};
