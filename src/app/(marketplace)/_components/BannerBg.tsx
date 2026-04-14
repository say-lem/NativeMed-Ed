export default function BannerBg({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`bg-[${color}] py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-2 flex-col flex items-center justify-center`}
    >
      {children}
    </div>
  );
}
