export default function TitleCase({ text }: { text: string }) {
  return (
    <h2 className="font-semibold text-4xl leading-[120%] tracking-[-2%] text-blackOthers mt-3 capitalize">
      {text}
    </h2>
  );
}
