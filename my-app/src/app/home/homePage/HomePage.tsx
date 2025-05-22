'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

import NavbarInicioSesion from '@/components/navbar/NavbarInicioSesion';
import FiltersBar from '@/components/filters/FiltersBar';
import Footer from '@/components/footer/Footer';
import LoginModal from '@/components/auth/authInicioSesion/LoginModal';
import RegisterModal from '@/components/auth/authregistro/RegisterModal';
import VehicleDataModal from '@/components/auth/authRegistroHost/VehicleDataModal';
import PaymentModal from '@/components/auth/authRegistroHost/PaymentModal';
import CompleteProfileModal from '@/components/auth/authRegistroHost/CompleteProfileModal';
import { BASE_URL } from '@/libs/api';

export default function MainHome() {
  const [activeModal, setActiveModal] = useState<'login' | 'register' | 'vehicleData' | 'paymentData' | 'completeProfile' | null>(null);

  const [vehicleData, setVehicleData] = useState<{
    placa: string;
    soat: string;
    imagenes: File[];
    id_vehiculo?: number; // Hacemos id_vehiculo opcional aquí
  } | null>(null);

  const [paymentData, setPaymentData] = useState<{
    tipo: "card" | "qr" | "cash";
    cardNumber?: string; 
    expiration?: string; 
    cvv?: string; 
    cardHolder?: string;
    qrImage?: File | null;
    efectivoDetalle?: string;
  } | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();
  const user = useUser();

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [user, router]);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Actualizamos para aceptar id_vehiculo como opcional
  const handleVehicleDataSubmit = (data: {
    placa: string;
    soat: string;
    imagenes: File[];
    id_vehiculo?: number; // Opcional para que coincida con VehicleDataModal
  }) => {
    setVehicleData(data);
    setActiveModal("paymentData");
  };

  // Actualizamos para que coincida con la estructura de PaymentModal
  const handlePaymentDataSubmit = (data: { 
    tipo: "card" | "qr" | "cash";
    cardNumber?: string; 
    expiration?: string; 
    cvv?: string; 
    cardHolder?: string;
    qrImage?: File | null;
    efectivoDetalle?: string;
  }) => {
    setPaymentData(data);
    setActiveModal('completeProfile');
  };

  const handleRegistrationComplete = () => {
    setActiveModal(null);
    displayToast('¡Tu registro como host fue completado exitosamente!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-principal)]">
      <header className="border-t border-b border-[rgba(215, 30, 30, 0.1)] shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
        <NavbarInicioSesion onBecomeHost={() => setActiveModal('vehicleData')} />
      </header>

      <header className="/* headerFilters */">
        <FiltersBar />
      </header>

      <main className="flex-grow p-8">
        <div className="/* scrollContent */">
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {activeModal === 'login' && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onRegisterClick={() => setActiveModal('register')}
          onPasswordRecoveryClick={() => console.log('Recuperar contraseña')}
        />
      )}

      {activeModal === 'register' && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal('login')}
        />
      )}

      {activeModal === 'vehicleData' && (
        <VehicleDataModal
          onNext={handleVehicleDataSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'paymentData' && vehicleData && (
        <PaymentModal
          onNext={handlePaymentDataSubmit}
          onClose={async () => {
            // Verificamos que id_vehiculo exista antes de usarlo
            if (vehicleData?.id_vehiculo) {
              const token = localStorage.getItem("token");
              await fetch(`${BASE_URL}/vehiculos/eliminar-vehiculo/${vehicleData.id_vehiculo}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'completeProfile' && vehicleData && paymentData && (
        <CompleteProfileModal
          vehicleData={vehicleData}
          paymentData={paymentData}
          onComplete={handleRegistrationComplete}
          onClose={() => setActiveModal('paymentData')}
        />
      )}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          {toastMessage}
        </div>
      )}
    </div>
  );
}