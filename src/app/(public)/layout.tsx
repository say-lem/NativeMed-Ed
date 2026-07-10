import PublicHeader from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import { getOptionalUser } from "@/lib/current-user";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getOptionalUser();
  return (
    <main className="min-h-full">
      <PublicHeader user={user} />
      {children}
      <Footer />
    </main>
  );
}
