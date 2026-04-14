import Image from "next/image";
import { FooterNavLink } from "../header/NavLink";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <>
      <footer className="bg-black pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-10 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-8 md:px-10 lg:px-15 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-0">
          <Image
            src={"/Images/nativeMedLogo.png"}
            alt="nativeMedLogo"
            height={100}
            width={98}
            className="w-[50px] sm:w-[60px] lg:w-[98px] h-auto"
          />

          <nav className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <FooterNavLink href="/" label="Home" />
            <FooterNavLink href="/products" label="Products" />
            <FooterNavLink href="/about" label="About" />
            <FooterNavLink href="/contact" label="Contact" />
          </nav>

          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-medium text-base sm:text-lg lg:text-2xl leading-[140%] tracking-[-2%] text-white w-full lg:w-[85%] capitalize">
              Stay up to date with our latest news & Classes
            </h3>
            <aside className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="email"
                className="border-[0.5px] px-3 sm:px-4 py-2.5 sm:py-3 flex-1 rounded-[8px] text-white text-sm lg:text-base min-w-0"
                placeholder="Enter your Email"
              />
              <Button className="">Sign Me Up</Button>
            </aside>
          </div>
        </div>
      </footer>

      <div className="border-t border-subtle-text bg-black py-4 sm:py-6 lg:py-8 text-center px-4">
        <p className="leading-6 tracking-[-0.31px] text-subtle-text text-xs sm:text-sm lg:text-base">
          © 2026 Native Medical Education. All rights reserved.
        </p>
      </div>
    </>
  );
}
