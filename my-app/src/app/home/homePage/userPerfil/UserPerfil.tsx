"use client";
  import { useState, useEffect } from 'react';

  import Inputlabel from "@/app/components/input/Inputlabel";
  import NavbarPerfilUsuario from "@/app/components/navbar/NavbarPerfilUsuario";
  import Button from "@/app/components/botons/botons";
  import FotoDePerfilEditable from "@/app/components/input/FotoDePerfilEditable";
  import NombreEditable from "@/app/components/input/NombreEditable";
  import TelefonoEditable from "@/app/components/input/TelefonoEditable";
  import MailIcon from "@/app/components/Icons/Email";
  import CalendarIcon from "@/app/components/Icons/Calendar";
  //import PhoneIcon from "@/app/components/Icons/Phone";
  import PerfilIcon from "@/app/components/Icons/Perfil"; // <-- Nuevo icono importado
  //import Padlock from "@/app/components/Icons/Candado";
  import { useRouter } from 'next/navigation';
  /* import { IdIcon } from "@/app/components/Icons/Doc_Identidad"; */
  import { useUser } from '@/hooks/useUser';
  
  export default function UserPerfilPage() {
    const user = useUser();
    const router = useRouter();

    // ✅ NUEVO: guardamos la imagen seleccionada aquí 👇
    /*const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
      user?.foto_perfil ? `http://localhost:3001${user.foto_perfil}` : null
    );*/
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    
    useEffect(() => {
      if (user?.foto_perfil) {
        setImagePreviewUrl(`http://localhost:3001${user.foto_perfil}`);
        console.log('✅ Foto cargada:', `http://localhost:3001${user.foto_perfil}`);
      }
    }, [user]);

    return (
      <>
        <NavbarPerfilUsuario />

        {/* Línea horizontal debajo del Navbar */}
        <div className="border-b border-gray-300"></div>

        <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8">
          
          {/* Contenedor principal: Avatar a la izquierda, Formulario a la derecha */}
          <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10">
            
            {/* Avatar (usando SolarUserBold, fondo plomo y borde) */}
            <div className="flex flex-col justify-center md:justify-start w-full md:w-1/3 items-center">
              <div className='border-2 rounded-3xl'>
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Foto de perfil"
                    className="w-34 h-34 object-cover rounded-3xl"
                  />
                  ) : (
                  <PerfilIcon className="w-32 h-32 text-black" />
                  )}
              </div>
              <FotoDePerfilEditable 
              setImagePreviewUrl={setImagePreviewUrl}/>

            </div>

            {/*  Título */}
            <div className="flex flex-col w-full md:w-2/3  items-start ">
              {/* TÍTULO */}
              <h1
                className="text-[var(--azul-oscuro)] text-2xl font-bold uppercase mb-6 text-center"
                style={{ fontFamily: 'var(--fuente-principal)' }}
              >
                INFORMACION PERSONAL
              </h1>

              {/* Formulario */}
              <form method="PUT" className="space-y-6 w-full md:w-2/3">
                
                {/* Input Nombre */}
                {user && <NombreEditable initialValue={user.nombre_completo} />}

                  
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

                

                {/* Inputs de Fecha y Teléfono (en fila) */}
                <div className="flex flex-row gap-x-4">
                  {/* Fecha (más ancho) */}
                  <div className="flex-grow">
                    <Inputlabel
                      id="Fecha"
                      label="Fecha de Nacimiento"
                      type="date"
                      
                      icono={<CalendarIcon />}
                      defaultValue={user?.fecha_nacimiento?.split('T')[0] || ''}
                      className="focus:ring-[var(--azul-oscuro)] border-[var(--azul-oscuro)] border-2 font-bold"
                      readOnly={true}
                    />
                  </div>

                  {/* Input Teléfono */}
                  {user && <TelefonoEditable initialValue={user.telefono?.toString() || ''} />}

                </div>

                {/* Botón Salir */}
                <div className="flex justify-center gap-6 pt-4 w-full">
                  <Button
                    id="Cancelar Perfil"
                    color="bg-white text-[#FCA311] border-2 border-gray-300 px-6 py-3 rounded-md hover:bg-[#FCA311] hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all w-full "
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
