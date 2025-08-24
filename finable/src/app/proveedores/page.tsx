"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createSession } from "@/lib/sessions";
import { signIn, signOut, useSession } from "next-auth/react";

interface Email {
  id: string;
  subject?: string;
  from?: string;
  fromName?: string;
  snippet?: string;
  bodyPreview?: string;
  receivedDateTime?: string;
  isRead?: boolean;
}

export default function ProveedoresPage() {
  const searchParams = useSearchParams();
  const [telefono, setTelefono] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/proveedores" });
  };

  const handleMicrosoftSignIn = () => {
    signIn("azure-ad", { callbackUrl: "/proveedores" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/proveedores" });
  };

  const fetchEmails = async (provider: "google" | "microsoft") => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/emails/${provider}`);
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.emails);
      } else {
        setError(data.error || "Error al obtener correos");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Página de Proveedores</h1>
      
      {telefono && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">Teléfono recibido: {telefono}</p>
        </div>
      )}

      {/* OAuth Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Conectar Cuentas de Email</h2>
        
        {status === "loading" ? (
          <div className="text-gray-600">Cargando...</div>
        ) : session ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                Conectado como: {session.user?.email} ({session.provider})
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => fetchEmails("google")}
                disabled={loading || session.provider !== "google"}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "Leer Correos Gmail"}
              </button>
              
              <button
                onClick={() => fetchEmails("microsoft")}
                disabled={loading || session.provider !== "azure-ad"}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "Leer Correos Outlook"}
              </button>
              
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Conecta tu cuenta de email para leer correos automáticamente.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Conectar con Google
              </button>
              
              <button
                onClick={handleMicrosoftSignIn}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#7fba00" d="M13 1h10v10H13z"/>
                  <path fill="#00a4ef" d="M1 13h10v10H1z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                Conectar con Microsoft
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Emails Display */}
      {emails.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Correos ({emails.length})
          </h3>
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">
                    {email.subject || "Sin asunto"}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {email.receivedDateTime && formatDate(email.receivedDateTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  De: {email.fromName || email.from || "Desconocido"}
                </p>
                <p className="text-gray-700">
                  {email.snippet || email.bodyPreview || "Sin contenido"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
