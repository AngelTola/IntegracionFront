'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Carousel.module.css';
import Image from 'next/image';

interface Vehicle {
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  colour: string;
  plate: string;
  description: string;
  pricePerDay: number;
  averageRating?: number;
}

interface VehiculoAPI {
  idvehiculo: string;
  imagen: string;
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  descripcion: string;
  tarifa: number;
  promedio_calificacion?: number;
}

type VehiculosAPIResponse = VehiculoAPI[];

export default function Carousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const obtenerVehiculosTop = async (): Promise<void> => {
    try {
      const response = await axios.get<VehiculosAPIResponse>(
        'https://vercel-back-speed-code.vercel.app/vehiculo/obtenerVehiculosTop'
      );
      const data = response.data;

      const formattedData: Vehicle[] = data.map((vehiculo: VehiculoAPI) => ({
        id: vehiculo.idvehiculo,
        imageUrl: vehiculo.imagen,
        brand: vehiculo.marca,
        model: vehiculo.modelo,
        colour: vehiculo.color,
        plate: vehiculo.placa,
        description: vehiculo.descripcion,
        pricePerDay: vehiculo.tarifa,
        averageRating: vehiculo.promedio_calificacion,
      }));

      setVehicles(formattedData);
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVehiculosTop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (vehicles.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles]);

  const handleNext = (): void => {
    setCurrentIndex(prev => (prev + 1) % vehicles.length);
  };

  const handlePrev = (): void => {
    setCurrentIndex(prev => (prev - 1 + vehicles.length) % vehicles.length);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar vehículos</div>;

  return (
    <>
      <h2 className={styles.topRentedTitle}>Más alquilados</h2>
      <div id="carousel" className={styles.carouselContainer}>
        <button 
          onClick={handlePrev}
          className={styles.navButton}
          aria-label="Anterior"
        >
          &lt;
        </button>
        
        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className={`${styles.slide} 
              ${index === currentIndex ? styles.active : ''}
              ${index === (currentIndex + 1) % vehicles.length ? styles.next : ''}
              ${index === (currentIndex - 1 + vehicles.length) % vehicles.length ? styles.prev : ''}
            `}
          >
            <div className={styles.imageContainer}>
              <Image
                width={1000}
                height={300}
                src={vehicle.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.info}>
              <h3>{vehicle.brand} {vehicle.model}</h3>
              <h2>{vehicle.description}</h2>
              <div className={styles.details}>
                <p className={styles.price}>Bs. {vehicle.pricePerDay}/día</p>
                <p className={styles.rating}>
                  ⭐ {vehicle.averageRating?.toFixed(2) || 'N/A'}
                </p>
              </div>
              </div>
          </div>
        ))}

        <button 
          onClick={handleNext}
          className={styles.navButton}
          aria-label="Siguiente"
        >
          &gt;
        </button>
      </div>
    </>
  );
}