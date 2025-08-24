"use client";

import { useState, useEffect } from "react";

type Account = {
  provider: string;
  email: string;
};

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Fetch connected accounts from your backend
  useEffect(() => {
    fetch("/api/accounts")
      .then(res => res.json())
      .then(data => setAccounts(data.accounts));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Connected Email Accounts</h1>

      {/* Connected Accounts */}
      <div className="space-y-2">
        {accounts && accounts.map((acc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border p-3 shadow"
          >
            <span>
              <b>{acc.provider}</b>: {acc.email}
            </span>
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                fetch(`/api/accounts/${acc.provider}/disconnect`, { method: "DELETE" })
                  .then(() => setAccounts(prev => prev.filter(a => a.email !== acc.email)));
              }}
            >
              Disconnect
            </button>
          </div>
        ))}

        {!accounts  && <p>No accounts connected yet.</p>}
      </div>

      {/* Connect Buttons */}
      <div className="flex gap-4">
        <a
          href="/api/oauth/google"
          className="rounded-lg bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600"
        >
          Connect Gmail
        </a>
        <a
          href="/api/oauth/microsoft"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          Connect Outlook
        </a>
      </div>
    </div>
  );
}
