import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeaderNavLink } from "./navLink";

export default function PublicHeader() {
  return (
    <header className="radialBgGradient min-h-25 flex items-center justify-between px-15 sticky top-0 backdrop-blur-md z-50 border-b border-white/20">
      <Image
        src={"/Images/nativeMedLogo.png"}
        alt="NativeMed Logo"
        width={49}
        height={50}
      />

      <nav className="space-x-8">
        <HeaderNavLink href="/" label="Home" />
        <HeaderNavLink href="/products" label="Products" />
        <HeaderNavLink href="/about" label="About" />
        <HeaderNavLink href="/contact" label="Contact" />
      </nav>

      <Button className="bg-primary100 font-semibold text-xs">
        Get Started
      </Button>
    </header>
  );
}
