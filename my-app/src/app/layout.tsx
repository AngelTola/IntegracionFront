// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";


export const metadata: Metadata = {
  title: "Sitio de Alquiler de Autos",
  description: "Proyecto de la U - Alquiler de vehículos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <header>
            <Navbar/>
          </header>

          <main style={{ flexGrow: 1, backgroundColor: '#ffffff' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}