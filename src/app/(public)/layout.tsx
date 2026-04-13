import PublicHeader from "@/components/shared/header/header";
import Footer from "@/components/shared/footer/footer";

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
