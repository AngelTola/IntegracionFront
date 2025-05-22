"use client";
import { useState, useEffect } from 'react';

import Inputlabel from "@/components/input/Inputlabel";
import NavbarPerfilUsuario from "@/components/navbar/NavbarPerfilUsuario";
import Button from "@/components/botons/botons";
import FotoDePerfilEditable from "@/components/input/FotoDePerfilEditable";
import NombreEditable from "@/components/input/NombreEditable";
import TelefonoEditable from "@/components/input/TelefonoEditable";
import MailIcon from "@/components/icons/Email";
import CalendarIcon from "@/components/icons/Calendar";
import PerfilIcon from "@/components/icons/Perfil";
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Image from "next/image"

export default function UserPerfilPage() {
  const user = useUser();
  const router = useRouter();

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [campoEnEdicion, setCampoEnEdicion] = useState<string | null>(null); // 👈 NUEVO

  useEffect(() => {
    if (user?.fotoPerfil) {
      setImagePreviewUrl(`http://34.69.214.55:3001${user.fotoPerfil}`);
      console.log('✅ Foto cargada:', `http://34.69.214.55:3001${user.fotoPerfil}`);
    }
  }, [user]);

  return (
    <>
      <NavbarPerfilUsuario />

      <div className="border-b border-gray-300"></div>

      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10">
          
          <div className="flex flex-col justify-center md:justify-start w-full md:w-1/3 items-center">
            <div className='border-2 rounded-3xl'>
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt="Foto de perfil"
                  className="w-34 h-34 object-cover rounded-3xl"
                />
              ) : (
                <PerfilIcon className="w-32 h-32 text-black" />
              )}
            </div>
            <FotoDePerfilEditable setImagePreviewUrl={setImagePreviewUrl} />
          </div>

          <div className="flex flex-col w-full md:w-2/3 items-start">
            <h1
              className="text-[var(--azul-oscuro)] text-2xl font-bold uppercase mb-6 text-center"
              style={{ fontFamily: 'var(--fuente-principal)' }}
            >
              INFORMACION PERSONAL
            </h1>

            <form method="PUT" className="space-y-6 w-full md:w-2/3">
              {/* Input Nombre */}
              {user && (
                <NombreEditable
                  initialValue={user.nombreCompleto}
                  campoEnEdicion={campoEnEdicion} 
                  setCampoEnEdicion={setCampoEnEdicion} 
                />
              )}

              {/* Input Email */}
              <Inputlabel
                id="Email"
                label="Email"
                type="Text"
                icono={<MailIcon />}
                defaultValue={user?.email || ''}
                className="focus:ring-[var(--azul-oscuro)] border-[var(--azul-oscuro)] border-2 font-bold"
                readOnly={true}
              />

              {/* Inputs de Fecha y Teléfono */}
              <div className="flex flex-row gap-x-4">
                <div className="flex-grow">
                  <Inputlabel
                    id="Fecha"
                    label="Fecha de Nacimiento"
                    type="date"
                    icono={<CalendarIcon />}
                    defaultValue={user?.fechaNacimiento?.split('T')[0] || ''}
                    className="focus:ring-[var(--azul-oscuro)] border-[var(--azul-oscuro)] border-2 font-bold"
                    readOnly={true}
                  />
                </div>

                {/* Input Teléfono */}
                {user && (
                  <TelefonoEditable
                    initialValue={user.telefono?.toString() || ''}
                    campoEnEdicion={campoEnEdicion} // 👈 NUEVO
                    setCampoEnEdicion={setCampoEnEdicion} // 👈 NUEVO
                  />
                )}
              </div>

              {/* Botón Salir */}
              <div className="flex justify-center gap-6 pt-4 w-full">
                <Button
                  id="Cancelar Perfil"
                  color="bg-white text-[#FCA311] border-2 border-gray-300 px-6 py-3 rounded-md hover:bg-[#FCA311] hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all w-full"
                  type="button"
                  Guardar="Salir"
                  deshabilitado={false}
                  onClick={() => router.push('/home/homePage')}
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
