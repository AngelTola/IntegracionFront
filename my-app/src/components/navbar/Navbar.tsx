'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from '@/components/auth/authInicioSesion/LoginModal';
import RegisterModal from '@/components/auth/authregistro/RegisterModal';

export default function Navbar() {
  const [activeBtn, setActiveBtn] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
          <Link href="/home">
            <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
              REDIBO
            </h1>
          </Link>

          <div className="flex overflow-x-auto md:overflow-visible relative w-full md:w-auto justify-start md:justify-center">
            {['Home', 'Autos', 'Botón3', 'Botón4', 'Botón5'].map((label, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveBtn(i);
                  if (i === 0) window.location.href = "/home";
                  else if (i === 1) window.location.href = "/autos";
                }}
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

          <div className="flex justify-center md:justify-end gap-0 w-full md:w-auto">
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
          </div>
        </nav>
      </div>

      {/* Modales integrados */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onRegisterClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onPasswordRecoveryClick={() => console.log("Recuperar contraseña")}
        />
      )}

      {showRegister && (
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
