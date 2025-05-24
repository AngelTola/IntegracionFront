"use client";
import { useState, useEffect } from 'react';

import Inputlabel from "@/app/components/input/Inputlabel";
import Button from "@/app/components/botons/botons";
import FotoDePerfilEditable from "@/app/components/input/FotoDePerfilEditable";
import NombreEditable from "@/app/components/input/NombreEditable";
import TelefonoEditable from "@/app/components/input/TelefonoEditable";
import MailIcon from "@/app/components/Icons/Email";
import PerfilIcon from "@/app/components/Icons/Perfil";
import FechaNacimientoEditable from "@/app/components/input/FechaNacimientoEditable";
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Image from "next/image"

export default function UserPerfilPage() {
  const user = useUser();
  const router = useRouter();

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [campoEnEdicion, setCampoEnEdicion] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fotoPerfil) {
      setImagePreviewUrl(user.fotoPerfil);
      console.log('✅ Foto cargada:', `http://localhost:3001${user.fotoPerfil}`);
    }
  }, [user]);
  
  if (!user) return null;
  
  return (
    <>
      <div className="border-b border-gray-300"></div>

      <main className="min-h-screen bg-white text-gray-900 flex justify-center px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10 mt-15">
          
          <div className="flex flex-col justify-center md:justify-start w-full md:w-1/3 items-center">
            <div className='border-2 rounded-3xl'>
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="w-34 h-34 object-cover rounded-3xl"
                  priority
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
                  edicionesUsadas={user.edicionesNombre || 0}
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
                  {user && (
                    <FechaNacimientoEditable
                      initialValue={user.fechaNacimiento?.split("T")[0] || ""}
                      campoEnEdicion={campoEnEdicion}
                      setCampoEnEdicion={setCampoEnEdicion}
                      setFechaVisual={(nuevaFecha) => user.fechaNacimiento = nuevaFecha}
                      edicionesUsadas={user.edicionesFecha || 0}
                    />
                  )}
                </div>

                {/* Input Teléfono */}
                {user && (
                  <TelefonoEditable
                    initialValue={user.telefono?.toString() || ''}
                    campoEnEdicion={campoEnEdicion}
                    setCampoEnEdicion={setCampoEnEdicion}
                    edicionesUsadas={user.edicionesTelefono || 0}
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
                  onClick={() => router.push('/home')}
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}