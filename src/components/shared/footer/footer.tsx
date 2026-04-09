import Image from "next/image";
import { FooterNavLink } from "../header/navLink";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <>
      <footer className="bg-black pt-40 pb-24 px-15 -mt-24">
        <div className="grid grid-cols-3">
          <Image
            src={"/Images/nativeMedLogo.png"}
            alt="nativeMedLogo"
            height={100}
            width={98}
          />

          <nav className="flex flex-col gap-6">
            <FooterNavLink href="/" label="Home" />
            <FooterNavLink href="/products" label="Products" />
            <FooterNavLink href="/about" label="About" />
            <FooterNavLink href="/contact" label="Contact" />
          </nav>

          <div className="space-y-4">
            <h3 className="font-medium text-2xl leading-[140%] tracking-[-2%] text-white w-[85%] capitalize">
              Stay up to date with our latest news & Classes
            </h3>
            <aside className="flex gap-2 items-center">
              <input
                type="email"
                className="border-[0.5px] px-4 py-3 flex-1 rounded-[8px] text-white"
                placeholder="Enter your Email"
              />
              <Button className="">Sign Me Up</Button>
            </aside>
          </div>
        </div>
      </footer>

      <div className="border-t border-Subtle-text bg-black py-8 text-center">
        <p className="leading-6 tracking-[-0.31px] text-Subtle-text">
          © 2026 Native Medical Education. All rights reserved.
        </p>
      </div>
    </>
  );
}
