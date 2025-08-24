"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Account = {
  provider: string;
  email: string;
};

// Helper function to get provider icon
const getProviderIcon = (provider: string) => {
  const providerLower = provider.toLowerCase();
  if (providerLower.includes('google') || providerLower.includes('gmail')) {
    return '/GoogleLogo.webp';
  }
  if (providerLower.includes('microsoft') || providerLower.includes('outlook')) {
    return '/microsoft.svg';
  }
  return null;
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
        {accounts && accounts.map((acc, idx) => {
          const iconSrc = getProviderIcon(acc.provider);
          return (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border p-3 shadow"
            >
              <div className="flex items-center gap-3">
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    alt={`${acc.provider} icon`}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                )}
                <span>
                  <b>{acc.provider}</b>: {acc.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  fetch(`/api/accounts/${acc.provider}/disconnect`, { method: "DELETE" })
                    .then(() => setAccounts(prev => prev.filter(a => a.email !== acc.email)));
                }}
              >
                Disconnect
              </Button>
            </div>
          );
        })}

        {!accounts && <p>No accounts connected yet.</p>}
      </div>

      {/* Connect Buttons */}
      <div className="flex gap-4">
        <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
          <Link href="/api/oauth/google">
            <Image
              src="/GoogleLogo.webp"
              alt="Google icon"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Connect Gmail
          </Link>
        </Button>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/api/oauth/microsoft">
            <Image
              src="/microsoft.svg"
              alt="Microsoft icon"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Connect Outlook
          </Link>
        </Button>
      </div>
    </div>
  );
}
