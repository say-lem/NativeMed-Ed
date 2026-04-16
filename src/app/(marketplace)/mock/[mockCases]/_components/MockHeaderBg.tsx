const pageHeaderColors = [
  "#992E6C",
  "#2368B6",
  "#906C00",
  "#D07910",
  "#19A535",
  "#0796A9",
  "#4425B3",
  "#721616",
];

function getRandomColor() {
  return pageHeaderColors[Math.floor(Math.random() * pageHeaderColors.length)];
}

export default function MockHeaderBg({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ backgroundColor: getRandomColor() }}
      className={`py-5 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 gap-2 flex-col flex items-center justify-center relative`}
    >
      {children}
    </div>
  );
}
