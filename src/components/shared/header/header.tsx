import Image from "next/image";

export default function PublicHeader() {
  return (
    <header className="radialBgGradient min-h-25 flex items-center px-15">
      <Image
        src={"/Images/nativeMedLogo.png"}
        alt="NativeMed Logo"
        width={49}
        height={50}
      />
    </header>
  );
}
