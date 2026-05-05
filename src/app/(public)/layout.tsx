import axios from "axios";
import PublicHeader from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { getAccessToken } from "@/lib/session";
import { me } from "@/services/auth.service";
import type { User } from "@/types/api";

async function loadOptionalUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const response = await me();
    return response.success ? response.data : null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) return null;
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await loadOptionalUser();
  return (
    <main className="min-h-full">
      <PublicHeader user={user} />
      {children}
      <Footer />
    </main>
  );
}
