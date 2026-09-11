import PublicHeader from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import BackToTop from "@/components/shared/BackToTop";
import FeedbackButton from "@/components/shared/feedback/FeedbackButton";
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
      <BackToTop />
      <FeedbackButton />
    </main>
  );
}
