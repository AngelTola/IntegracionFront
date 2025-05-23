// src/libs/authService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // Obtener la respuesta como JSON
  const data = await res.json();

  // Si la respuesta no es exitosa, lanzar un error con el mensaje del backend
  if (!res.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  // Retornar los datos si todo está bien
  return data;
}