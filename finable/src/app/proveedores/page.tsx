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
      const createSessionAsync = async () => {
        const session = await createSession(tel);
        Cookies.set("session", session, {
          secure: true, // only sent over https
          sameSite: "strict",
          expires: 7, // 7 days
        });
        // Save cookie securely (works client-side only, httpOnly requires server-side)
        Cookies.set("telefono", tel, {
          secure: true, // only sent over https
          sameSite: "strict",
          expires: 7, // 7 days
        });
      };
      createSessionAsync();
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
