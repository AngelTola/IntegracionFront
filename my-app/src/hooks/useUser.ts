import { useEffect, useState } from 'react';
import { BASE_URL } from '@/libs/api';

interface User {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: number;
  fechaNacimiento?: string;
  fotoPerfil?: string;
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