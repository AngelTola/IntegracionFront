"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BASE_URL } from "@/libs/api"
import { useRouter } from "next/navigation"

export default function CompleteProfileModal({
  onComplete,
  onClose,
  onSuccess,
}: {
  onComplete: (data: { name: string; birthDate: string }) => void
  onClose: () => void
  onSuccess?: () => void
}) {
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [birthError, setBirthError] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState("")
  const [error, setError] = useState("")
  const userEmail = localStorage.getItem("google_email")
  const router = useRouter()

  useEffect(() => {
    if (!birthDay || !birthMonth || !birthYear) {
      setBirthError("")
      return
    }

    const selectedDate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay))

    const today = new Date()

    if (selectedDate > today) {
      setBirthError("La fecha no puede ser futura")
      return
    }

    let age = today.getFullYear() - selectedDate.getFullYear()
    const m = today.getMonth() - selectedDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
      age--
    }

    if (age < 18) {
      setBirthError("Debes tener al menos 18 años")
    } else if (age > 85) {
      setBirthError("La edad máxima permitida es 85 años")
    } else {
      setBirthError("")
    }
  }, [birthDay, birthMonth, birthYear])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    if (name.trim().length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres")
      return
    }

    if (!birthDay || !birthMonth || !birthYear) {
      setError("Completa la fecha de nacimiento")
      return
    }

    const birthDate = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay))

    // Validaciones Fecha de nacimiento
    if (birthDate > new Date()) {
      setError("La fecha de nacimiento no puede ser futura")
      return
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      setError("Debes tener al menos 18 años")
      return
    } else if (age > 85) {
      setError("La edad máxima permitida es de 85 años")
      return
    }

    const cleanPhone = phoneValue.replace(/\D/g, "")

    if (!/^[67]/.test(cleanPhone)) {
      setPhoneError(true)
      setPhoneMessage("El número debe comenzar con 6 o 7")
      return
    } else if (!/^\d{8}$/.test(cleanPhone)) {
      setPhoneError(true)
      setPhoneMessage("El número debe tener exactamente 8 dígitos")
      return
    } else {
      try {
        const res = await fetch(`${BASE_URL}/check-phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telefono: Number.parseInt(cleanPhone) }),
        })

        const data = await res.json()
        if (data.exists) {
          setPhoneError(true)
          setPhoneMessage("Este número ya está registrado")
          return
        } else {
          setPhoneError(false)
          setPhoneMessage("")
        }
      } catch (err) {
        console.error("Error al verificar teléfono:", err)
        setPhoneError(true)
        setPhoneMessage("No se pudo validar el número")
        return
      }
    }

    setError("")

    try {
      console.log("📤 Enviando datos al backend:", {
        email: userEmail,
        nombre: name.trim().split(" ")[0] || name.trim(), // Primer nombre
        apellido: name.trim().split(" ").slice(1).join(" ") || "", // Resto como apellido
        fechaNacimiento: birthDate.toISOString(),
        telefono: Number.parseInt(cleanPhone),
      })

      const res = await fetch(`${BASE_URL}/google/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: userEmail,
          nombre: name.trim().split(" ")[0] || name.trim(),
          apellido: name.trim().split(" ").slice(1).join(" ") || "",
          fechaNacimiento: birthDate.toISOString(),
          telefono: Number.parseInt(cleanPhone),
        }),
      })

      if (!res.ok) {
        const data = await res.json()

        if (data.message?.includes("registrado con email")) {
          alert("Esta cuenta ya fue registrada con correo y contraseña. Por favor inicia sesión manualmente.")
          return
        }

        throw new Error(data.message || "No se pudo actualizar el perfil")
      }

      const data = await res.json()

      // Guardar el token si lo recibimos
      if (data.token) {
        localStorage.setItem("token", data.token)
        if (data.user?.nombreCompleto) {
          localStorage.setItem("nombre_completo", data.user.nombreCompleto)
        }
      }

      toast.success("¡Perfil completado con éxito!", {
        position: "top-center",
        autoClose: 2000,
      })

      // Notificar al componente padre
      onComplete({
        name: name.trim(),
        birthDate: birthDate.toISOString(),
      })

      // Redirigir después de un breve retraso
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/home/homePage")
        }
      }, 2000)
    } catch (err) {
      console.error("Error al guardar datos de perfil", err)
      setError("No se pudo guardar los datos. Intenta nuevamente.")
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/20">
      <div className="w-full h-full p-10 bg-[var(--blanco)] sm:h-auto sm:w-[34rem] sm:rounded-[35px] sm:shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>

        <h1 className="text-center text-[var(--azul-oscuro)] text-[1.44rem] font-medium leading-normal mb-4">
          Completar Perfil de Google
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[var(--azul-oscuro)] mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError("")
              }}
              className={`p-3 border-2 rounded-lg ${nameError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Ingresa tu nombre completo"
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Campo Fecha de Nacimiento */}
          <div className="flex flex-col">
            <label className="text-[var(--azul-oscuro)] mb-2">Fecha de Nacimiento *</label>
            <div className="flex gap-2">
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className={`p-3 border-2 rounded-lg flex-1 ${birthError ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Día</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className={`p-3 border-2 rounded-lg flex-1 ${birthError ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Mes</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className={`p-3 border-2 rounded-lg flex-1 ${birthError ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Año</option>
                {[...Array(100)].map((_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
            {birthError && <p className="text-red-500 text-sm mt-1">{birthError}</p>}
          </div>

          {/* Campo Teléfono */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-[var(--azul-oscuro)] mb-2">
              Teléfono (opcional)
            </label>
            <div className="flex">
              <span className="p-3 bg-gray-100 border-2 border-r-0 border-gray-300 rounded-l-lg">+591</span>
              <input
                type="tel"
                id="phone"
                value={phoneValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 8) {
                    setPhoneValue(value)
                    setPhoneError(false)
                    setPhoneMessage("")
                  }
                }}
                className={`p-3 border-2 border-l-0 rounded-r-lg flex-1 ${phoneError ? "border-red-500" : "border-gray-300"}`}
                placeholder="12345678"
                maxLength={8}
              />
            </div>
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneMessage}</p>}
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[var(--naranja)] text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            Completar Perfil
          </button>
        </form>
      </div>
    </div>
  )
}
