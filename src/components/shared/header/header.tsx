"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeaderNavLink } from "./NavLink";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import NamedHeader from "./NamedHeader";

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // False Auth state for testing
  const [isLoggedIn] = useState(true);

  return (
    <header className="radialBgGradient min-h-14 sm:min-h-16 md:min-h-20 lg:min-h-25 flex items-center justify-between px-4 sm:px-6 lg:px-15 sticky top-0 backdrop-blur-md z-50 border-b border-white/20">
      <Image
        src={"/Images/nativeMedLogo.png"}
        alt="NativeMed Logo"
        width={49}
        height={50}
        className="w-8 sm:w-9 md:w-10 lg:w-12.25"
      />

      <nav className="hidden lg:flex space-x-8">
        <HeaderNavLink href="/" label="Home" />
        <HeaderNavLink href="/products" label="Products" />
        <HeaderNavLink href="/about" label="About" />
        <HeaderNavLink href="/contact" label="Contact" />
      </nav>

      {isLoggedIn ? (
        <div className="flex items-center gap-2 sm:gap-4">
          <NamedHeader />
          <button
            className="lg:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/register">
            <Button className="bg-primary-100 font-semibold text-xs hidden sm:inline-flex">
              Get Started
            </Button>
          </Link>
          <button
            className="lg:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f8f9ff]/95 backdrop-blur-md flex flex-col items-center py-6 sm:py-8 gap-4 sm:gap-6 lg:hidden border-b border-white/20 shadow-xl">
          <div onClick={() => setIsOpen(false)}>
            <HeaderNavLink href="/" label="Home" />
          </div>
          <div onClick={() => setIsOpen(false)}>
            <HeaderNavLink href="/products" label="Products" />
          </div>
          <div onClick={() => setIsOpen(false)}>
            <HeaderNavLink href="/about" label="About" />
          </div>
          <div onClick={() => setIsOpen(false)}>
            <HeaderNavLink href="/contact" label="Contact" />
          </div>

          {!isLoggedIn && (
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button className="bg-primary-100 font-semibold text-xs mt-2 px-8">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
