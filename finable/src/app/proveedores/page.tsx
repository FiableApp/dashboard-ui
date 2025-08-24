"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createSession } from "@/lib/sessions";

export default function ProveedoresPage() {

    

  const searchParams = useSearchParams();
  const [telefono, setTelefono] = useState<string | null>(null);

  useEffect(() => {
    const tel = searchParams.get("telefono");
    if (tel) {
      setTelefono(tel);
      
      const validateAndCreateSession = async () => {
        try {
          // Check if session exists and validate it
          const validateResponse = await fetch("/api/session/validate", {
            method: "GET",
            credentials: "include" // Include cookies in request
          });

          if (!validateResponse.ok) {
            // Session invalid or doesn't exist - create new one
            const session = await createSession(tel);
            Cookies.set("telefono", tel, {
              secure: true,
              sameSite: "strict", 
              expires: 7
            });
          } else {
            // Session is valid
            const data = await validateResponse.json();
            if (data.data.telefono !== tel) {
              // Phone number mismatch - create new session
              const session = await createSession(tel);
              Cookies.set("telefono", tel, {
                secure: true,
                sameSite: "strict",
                expires: 7
              });
            }
          }
        } catch (error) {
          console.error("Error validating/creating session:", error);
        }
      };

      validateAndCreateSession();
    }
  }, [searchParams]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Página de Proveedores</h1>
      {telefono ? (
        <p>Teléfono recibido: {telefono}</p>
      ) : (
        <p>No se encontró teléfono en la URL.</p>
      )}
    </div>
  );
}
