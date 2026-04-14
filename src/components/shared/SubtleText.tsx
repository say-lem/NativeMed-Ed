export default function SubtleText({ text }: { text: string }) {
  return (
    <p className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
      {text}
    </p>
  );
}
