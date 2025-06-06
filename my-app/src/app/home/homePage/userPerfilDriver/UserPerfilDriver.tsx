"use client";

import React, { useState, useEffect } from "react";
import PerfilIcon from "@/app/components/Icons/Perfil";
import UserIcon from "@/app/components/Icons/User";
import PhoneIcon from "@/app/components/Icons/Phone";
import LicenciaConductorIcon from "@/app/components/Icons/LicenciaConductor";
import CategoriaIcon from "@/app/components/Icons/Categoria";
import CalendarIcon from "@/app/components/Icons/Calendar";
import { SolarGalleryOutline } from "@/app/components/Icons/Gallery";
import { useUser } from '@/hooks/useUser';
import Image from "next/image"
import { BASE_URL } from "@/libs/autoServices";

// Tipo para los datos del driver
type DriverData = {
  usuario: {
    nombreCompleto: string;
    fotoPerfil?: string;
  };
  sexo: string;
  telefono: string;
  licencia: string;
  tipoLicencia: string;
  fechaEmision: string;
  fechaExpiracion: string;
  anversoUrl: string;
  reversoUrl: string;
};

export default function UserPerfilDriver() {
  const [showGallery, setShowGallery] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token de autenticación.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Aún no te has registrado como conductor.");
          } else {
            setError("Error al cargar los datos del perfil del conductor.");
          }
          setDriverData(null);
        } else {
          const data = await res.json();
          setDriverData(data);
        }
      } catch (err) {
        console.error("Error al cargar perfil del driver:", err);
        setError("Error inesperado al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  useEffect(() => {
    if (user?.fotoPerfil) {
      setImagePreviewUrl(`${BASE_URL}${user.fotoPerfil}`);
    }
  }, [user]);
  if (!user) return null;

  return (
    <>
      <main className="min-h-screen bg-white text-[#11295B] px-10 py-10">
        <h1 className="text-center text-2xl font-bold mb-10">
          INFORMACION PERSONAL CONDUCTOR
        </h1>

        {loading ? (
          <p className="text-center text-lg">Cargando datos...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          driverData && (
            <main className="min-h-screen bg-white text-gray-900 flex justify-center px-4 sm:px-6 lg:px-6 py-6">
              <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10 mt-1">
      
              {/* Imagen de perfil */}
              <div className="w-full md:w-[160px] flex-shrink-0 flex justify-center md:justify-start">
                <div className="border-2 border-gray-300 rounded-2xl overflow-hidden w-[120px] h-[120px]">
                  {imagePreviewUrl ? (
                    <Image
                      width={250}
                      height={250}
                      src={imagePreviewUrl}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PerfilIcon className="w-full h-full text-gray-500 p-4" />
                  )}
                </div>
              </div>

              {/* Formulario */}
              <div className="flex flex-col gap-6 w-full max-w-3xl ml-10">
                {/* Nombre y sexo */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold" htmlFor="nombre">
                      Nombre Completo:
                    </label>
                    <div className="relative">
                      <input
                        id="nombre"
                        type="text"
                        value={driverData.usuario.nombreCompleto || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <UserIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-semibold" htmlFor="sexo">
                      Sexo
                    </label>
                    <input
                      id="sexo"
                      type="text"
                      value={driverData.sexo || ""}
                      className="w-full py-2 px-4 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-semibold">Teléfono</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.telefono || ""}
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                    <PhoneIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  </div>
                </div>

                {/* Licencia de Conducir + botón galería */}
                <div className="flex gap-2 items-end">
                  <div className="w-full">
                    <label className="text-sm font-semibold">
                      Licencia de Conducir
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={driverData.licencia || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <LicenciaConductorIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGallery(true)}
                    className="p-2 border-2 border-black rounded hover:bg-gray-100"
                  >
                    <SolarGalleryOutline className="w-6 h-6 text-[#11295B]" />
                  </button>
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-sm font-semibold">Categoría</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={driverData.tipoLicencia}
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                    <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  </div>
                </div>

                {/* Fechas */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Emisión</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={driverData.fechaEmision?.split("T")[0] || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Vencimiento</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={driverData.fechaExpiracion?.split("T")[0] || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          )
        )}

        {/* Modal Galería */}
        {showGallery && driverData && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] max-w-4xl">
              <h2 className="text-xl font-bold mb-4 text-[#11295B]">
                Galería de Licencia
              </h2>
              <div className="flex justify-around">
                {driverData.anversoUrl ? (
                  <Image
                    width={250}
                    height={250}
                    src={driverData.anversoUrl}
                    alt="Anverso Licencia"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.anversoUrl)}
                  />
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                    IMG
                  </div>
                )}

                {driverData.reversoUrl ? (
                  <Image
                    width={250}
                    height={250}
                    src={driverData.reversoUrl}
                    alt="Reverso Licencia"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.reversoUrl)}
                  />
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                    IMG
                  </div>
                )}
              </div>
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-[#11295B] text-white rounded hover:bg-blue-900"
                  onClick={() => setShowGallery(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de zoom de imagen */}
        {zoomUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            onClick={() => setZoomUrl(null)}
          >
            <Image
              width={250}
              height={250}
              src={zoomUrl}
              alt="Imagen ampliada"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg"
            />
          </div>
        )}
      </main>
    </>
  );
}
