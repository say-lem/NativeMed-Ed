export default function SubtleText({ text }: { text: string }) {
  return (
    <p className="font-light text-xs sm:text-sm md:text-base lg:text-lg leading-[150%] text-subtle-text">
      {text}
    </p>
  );
}
