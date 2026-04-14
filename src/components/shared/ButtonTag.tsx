import Image from "next/image";
import { Button } from "../ui/button";

export default function ButtonTag({ title }: { title: string }) {
  return (
    <Button className="tagStarBg font-bold tracking-[-1%] leading-[150%] space-x-1 text-primary-100 py-2 px-3 rounded-[100px]">
      <Image src="/Images/tagStar.png" alt="Tag Star" width={18} height={18} />
      <span>{title}</span>
    </Button>
  );
}
