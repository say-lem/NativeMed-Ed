import PublicHeader from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full">
      <PublicHeader />
      {children}
      <Footer />
    </main>
  );
}
