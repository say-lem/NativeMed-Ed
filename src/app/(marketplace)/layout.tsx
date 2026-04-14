import NamedHeader from "@/components/shared/header/NamedHeader";
import SideNav from "./_components/SideNav";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <aside className="basis-[24vw] pt-4 border-r-[0.5px] border-gray-2 min-h-screen pr-4 pb-10">
        <SideNav />
      </aside>
      <aside className="flex-1 pt-9 space-y-5">
        <div className="flex justify-end px-10">
          <NamedHeader />
        </div>

        {children}
      </aside>
    </main>
  );
}
