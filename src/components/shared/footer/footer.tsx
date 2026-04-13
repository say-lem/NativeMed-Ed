import Image from "next/image";
import { FooterNavLink } from "../header/navLink";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <>
      <footer className="bg-black pt-24 md:pt-40 pb-12 md:pb-24 px-4 md:px-15 -mt-12 md:-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-0">
          <Image
            src={"/Images/nativeMedLogo.png"}
            alt="nativeMedLogo"
            height={100}
            width={98}
            className="w-[60px] md:w-[98px] h-auto"
          />

          <nav className="flex flex-col gap-4 md:gap-6">
            <FooterNavLink href="/" label="Home" />
            <FooterNavLink href="/products" label="Products" />
            <FooterNavLink href="/about" label="About" />
            <FooterNavLink href="/contact" label="Contact" />
          </nav>

          <div className="space-y-4">
            <h3 className="font-medium text-lg md:text-2xl leading-[140%] tracking-[-2%] text-white w-full md:w-[85%] capitalize">
              Stay up to date with our latest news & Classes
            </h3>
            <aside className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="email"
                className="border-[0.5px] px-4 py-3 flex-1 rounded-[8px] text-white text-sm md:text-base min-w-0"
                placeholder="Enter your Email"
              />
              <Button className="">Sign Me Up</Button>
            </aside>
          </div>
        </div>
      </footer>

      <div className="border-t border-Subtle-text bg-black py-6 md:py-8 text-center px-4">
        <p className="leading-6 tracking-[-0.31px] text-Subtle-text text-xs sm:text-sm md:text-base">
          © 2026 Native Medical Education. All rights reserved.
        </p>
      </div>
    </>
  );
}
