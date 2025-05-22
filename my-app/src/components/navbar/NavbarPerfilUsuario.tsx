"use client";
import Link from 'next/link';

export default function NavbarPerfilUsuario() {
  return (
    <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[#4B5563] shadow-md shadow-gray-400 font-[var(--fuente-principal)] bg-[var(--blanco)] relative z-10">
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <Link href="/home/homePage">
        <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
          REDIBO
        </h1>
        </Link>
      </nav>
    </div>
  );
}
