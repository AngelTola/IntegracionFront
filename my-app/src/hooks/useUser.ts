import { useEffect, useState } from 'react';

interface User {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: number;
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
        const res = await fetch(`${BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('✅ User cargado:', data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUser();
  }, []);

  return user;
};