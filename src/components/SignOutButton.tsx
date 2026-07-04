"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button 
      onClick={async () => {
        await authClient.signOut();
        router.push("/portal/login");
        router.refresh();
      }}
      className="bg-red-50 text-red-600 border border-red-100 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
    >
      Sign Out
    </button>
  );
}
