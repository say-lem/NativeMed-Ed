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

export function GetRandomColor() {
  return pageHeaderColors[Math.floor(Math.random() * pageHeaderColors.length)];
}
