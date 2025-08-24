"use client";
import { useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);

  const getUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div>
      <button onClick={getUsers} className="px-4 py-2 bg-blue-500 text-white">
        Load Users
      </button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
