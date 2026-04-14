export default function BannerBg({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`bg-[${color}] py-8 gap-2 flex-col flex items-center justify-center`}
    >
      {children}
    </div>
  );
}
