import { EXPO_PUBLIC_API_URL } from "@/shared/constants/constants";

export type MobileAuthResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at?: string;
  };
  token: string; // app JWT issued by backend
};

// Plain fetcher to allow prefetch/use outside hooks
export async function postGoogleIdToken(idToken: string): Promise<MobileAuthResponse> {
  const base = EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;
  if (!base) throw new Error("EXPO_PUBLIC_API_URL is not set");

  const res = await fetch(`${base.replace(/\/$/, "")}/auth/google/mobile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Mobile auth failed: ${res.status} ${msg}`);
  }

  return (await res.json()) as MobileAuthResponse;
}

