import AdminHomepageHero from "./_components/AdminHomepageHero";
import AdminHomepageTabs from "./_components/AdminHomepageTabs";
import { getHomepageData } from "@/services/homepage.service";
import { getAdminFreeProducts } from "@/services/freeProducts.service";

export default async function AdminHomepagePage() {
  const [homepageRes, productsRes] = await Promise.all([
    getHomepageData(),
    getAdminFreeProducts(1, 100),
  ]);
  if (!homepageRes.success) throw new Error(homepageRes.message);
  if (!productsRes.success) throw new Error(productsRes.message);

  const { caseNumber, testimonialsCount, registrarsCount, youtubeLinks } = homepageRes.data;

  return (
    <section>
      <AdminHomepageHero />
      <AdminHomepageTabs
        caseNumber={caseNumber}
        testimonialsCount={testimonialsCount}
        registrarsCount={registrarsCount}
        youtubeLinks={youtubeLinks}
        freeProducts={productsRes.data.items}
      />
    </section>
  );
}
