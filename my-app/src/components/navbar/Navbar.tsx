'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from '@/components/auth/authInicioSesion/LoginModal';
import RegisterModal from '@/components/auth/authregistro/RegisterModal';
import { useUser } from '@/hooks/useUser';

interface DynamicNavbarProps {
  onBecomeHost?: () => void;
}

export default function DynamicNavbar({ onBecomeHost }: DynamicNavbarProps) {
  const [activeBtn, setActiveBtn] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  
  const router = useRouter();
  const user = useUser();

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    const nombreCompleto = localStorage.getItem('nombre_completo');
    const userPicture = localStorage.getItem('user_picture');
    
    setIsLoggedIn(!!token);
    setUserName(nombreCompleto || '');
    
    if (userPicture) {
      setProfilePhotoUrl(userPicture);
    } else if (user?.fotoPerfil) {
      setProfilePhotoUrl(`http://34.69.214.55:3001${user.fotoPerfil}`);
    } else {
      setProfilePhotoUrl(null);
    }
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      updateAuthState();
    };

    window.addEventListener('authChange', handleAuthChange);
    
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (user?.fotoPerfil && !localStorage.getItem('user_picture')) {
      setProfilePhotoUrl(`http://34.69.214.55:3001${user.fotoPerfil}`);
    }
    if (user?.nombre && !localStorage.getItem('nombre_completo')) {
      setUserName(user.nombre);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre_completo');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_picture');
    
    setIsLoggedIn(false);
    setUserName('');
    setProfilePhotoUrl(null);
    setIsMenuOpen(false);
    
    window.dispatchEvent(new Event('authChange'));
    
    router.push('/');
  };

  const handleNavigation = (index: number) => {
    setActiveBtn(index);
    if (index === 0) {
      if (isLoggedIn) {
        router.push('/home');
      }else{
        router.push('/home');
      }
    } else if (index === 1) {
      router.push('/autos');
    }
  };

  return (
    <>
      <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          {/* Logo */}
          <Link href={isLoggedIn ? "/home/homePage" : "/home"}>
            <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
              REDIBO
            </h1>
          </Link>

          {/* Botones de navegación - Siempre visibles */}
          <div className="flex overflow-x-auto md:overflow-visible relative w-full md:w-auto justify-start md:justify-center">
            {['Home', 'Autos', 'Botón3', 'Botón4', 'Botón5'].map((label, i) => (
              <button
                key={i}
                onClick={() => handleNavigation(i)}
                className={`relative px-6 md:px-12 py-[0.2rem] border border-[#00000033] text-[var(--azul-oscuro)] 
                  font-[var(--tamaño-regular)] bg-[var(--blanco)] shadow-[var(--sombra)] text-sm md:text-base
                  ${i === 0 ? 'rounded-l-full border-r-0' : ''}
                  ${i === 4 ? 'rounded-r-full border-l-0' : ''}
                  ${i !== 0 && i !== 4 ? 'border-x-0' : ''}
                  ${activeBtn === i ? 'font-semibold' : ''}
                `}
              >
                {label}
                {i !== 4 && (
                  <span className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
                )}
                {i !== 0 && (
                  <span className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
                )}
              </button>
            ))}
          </div>

          {/* Sección derecha - Dinámica según estado de autenticación */}
          <div className="flex justify-center md:justify-end gap-0 w-full md:w-auto">
            {isLoggedIn ? (
              /* Usuario logueado - Mostrar perfil */
              <div className="relative z-[1000] flex items-center gap-0 bg-[var(--naranja)] rounded-[20px] shadow-[var(--sombra)] overflow-visible">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="flex-1 md:flex-none px-4 md:px-8 py-[0.4rem] font-[var(--tamaña-bold)] text-[var(--blanco)] text-sm md:text-base whitespace-nowrap"
                >
                  {userName || user?.nombre || 'Usuario'}
                </button>
                <div className="flex items-center justify-center px-3 md:px-4">
                  {profilePhotoUrl ? (
                    <Image
                      src={profilePhotoUrl}
                      alt="Foto de perfil"
                      width={32}
                      height={32}
                      className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full border border-white"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6 text-[var(--blanco)]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                
                {/* Menú desplegable del perfil */}
                {isMenuOpen && (
                  <ProfileMenu 
                    onLogout={handleLogout} 
                    router={router} 
                    onBecomeHost={onBecomeHost || (() => {})} 
                  />
                )}
              </div>
            ) : (
              /* Usuario no logueado - Mostrar botones de auth */
              <>
                <button 
                  onClick={() => setShowRegister(true)} 
                  className="cursor-pointer w-1/2 md:w-auto px-4 md:px-8 py-[0.4rem] rounded-l-[20px] bg-[var(--naranja-46)] font-[var(--tamaño-regular)] text-[var(--azul-oscuro)] shadow-[var(--sombra)] text-sm md:text-base"
                >
                  Registrarse
                </button>
                <button 
                  onClick={() => setShowLogin(true)} 
                  className="cursor-pointer w-1/2 md:w-auto px-4 py-[0.4rem] rounded-r-[20px] bg-[var(--naranja)] text-[var(--blanco)] font-[var(--tamaña-bold)] shadow-[var(--sombra)] transition-transform duration-100 active:scale-[0.97] active:shadow-[0_1px_3px_rgba(0,0,0,0.2)] text-sm md:text-base"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Modales de autenticación - Solo se muestran cuando no está logueado */}
      {!isLoggedIn && showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onRegisterClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onPasswordRecoveryClick={() => console.log("Recuperar contraseña")}
        />
      )}

      {!isLoggedIn && showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onLoginClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

function ProfileMenu({
  onLogout,
  router,
  onBecomeHost
}: {
  onLogout: () => void;
  router: ReturnType<typeof useRouter>;
  onBecomeHost: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--blanco)] border rounded-lg shadow-lg z-[9999] font-[var(--tamaña-bold)]">
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--naranja)] hover:bg-[var(--naranja-46)] rounded-t-lg"
        onClick={() => router.push('/home/homePage/userPerfil')}
      >
        <h2 className="hover:text-[var(--blanco)]">Ver perfil</h2>
      </button>

      <button 
        className="block w-full text-left px-4 py-2 text-[var(--naranja)] hover:bg-[var(--naranja-46)]"
        onClick={onBecomeHost}
      >
        <h2 className="hover:text-[var(--blanco)]">Quiero ser Host</h2>
      </button>

      <button 
        className="block w-full text-left px-4 py-2 text-[var(--naranja)] hover:bg-[var(--naranja-46)] rounded-b-lg"
        onClick={onLogout}
      >
        <h2 className="hover:text-[var(--blanco)]">Cerrar sesión</h2>
      </button>
    </div>
  );
}