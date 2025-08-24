export async function createSession(telefono: string): Promise<string> {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefono }),
    });

    const data = await res.json();
    console.log("Respuesta:", data);
    return data.value;
  }