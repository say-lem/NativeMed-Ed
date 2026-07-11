const DEFAULT_HEADER_COLOR = "#2D135C";

export default function MockHeaderBg({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ backgroundColor: DEFAULT_HEADER_COLOR }}
      className={`py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-2 flex-col flex items-center justify-center relative`}
    >
      {children}
    </div>
  );
}
