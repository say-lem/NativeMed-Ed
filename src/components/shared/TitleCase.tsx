export default function TitleCase({ text }: { text: string }) {
  return (
    <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-[120%] tracking-[-2%] text-black-others mt-3 capitalize">
      {text}
    </h2>
  );
}

export function BannerTitleCase({ text }: { text: string }) {
  return (
    <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-[130%] tracking-[-2%] text-white capitalize">
      {text}
    </h2>
  );
}

export function AnotherTitleCase({ text }: { text: string }) {
  return (
    <h2
      className="font-semibold
    text-lg lg:text-2xl leading-[130%] tracking-[-2%] text-black-others capitalize"
    >
      {text}
    </h2>
  );
}
