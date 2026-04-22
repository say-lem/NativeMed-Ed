interface Prop {
  text: string;
}

export function MockHeaderText({ text }: Prop) {
  return (
    <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[120%] tracking-[-2%] text-black capitalize">
      {text}
    </h2>
  );
}

export function MockTagText({ text }: Prop) {
  return (
    <h3 className="font-semibold text-xs sm:text-sm leading-[150%] tracking-[-2%] text-subtle-text capitalize">
      {text}
    </h3>
  );
}

export function MockNormalText({ text }: Prop) {
  return (
    <p className="text-sm sm:text-base text-black font-medium leading-[120%] tracking-[-1%] capitalize inline">
      {text}
    </p>
  );
}

export function MockText({
  text,
  color,
  weight,
  size,
}: {
  text: string;
  color?: string;
  weight?: string;
  size?: string;
}) {
  return <p className={`font-${weight} text-${color} text-${size}`}>{text}</p>;
}
