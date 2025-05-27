import { useEffect, useState } from 'react';
import { BASE_URL } from "@/libs/autoServices";

interface User {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  fotoPerfil?: string;
  edicionesNombre: number; // 👈 AÑADIR ESTO
  edicionesTelefono: number;
  edicionesFecha: number;

  driverBool: boolean;
  host: boolean
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('✅ User cargado:', data.user); // <-- DEBUG: para verificar que viene la foto
        setUser(data.user);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUser();
  }, []);

  return user;
};