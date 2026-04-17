import { GetRandomColor } from "../../_components/GetRandomColor";

export default function MockHeaderBg({
  children,
}: {
  children: React.ReactNode;
}) {
  const color = GetRandomColor();
  return (
    <div
      style={{ backgroundColor: color }}
      className={`py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-2 flex-col flex items-center justify-center relative`}
    >
      {children}
    </div>
  );
}
