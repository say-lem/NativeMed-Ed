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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="radialBgGradient min-h-20 md:min-h-25 flex items-center justify-between px-5 md:px-15 sticky top-0 backdrop-blur-md z-50 border-b border-white/20">
      <Image
        src={"/Images/nativeMedLogo.png"}
        alt="NativeMed Logo"
        width={49}
        height={50}
        className="w-10 md:w-12.25"
      />

      <nav className="hidden lg:flex space-x-8">
        <HeaderNavLink href="/" label="Home" />
        <HeaderNavLink href="/products" label="Products" />
        <HeaderNavLink href="/about" label="About" />
        <HeaderNavLink href="/contact" label="Contact" />
      </nav>

      {isLoggedIn ? (
        <NamedHeader />
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/register">
            {" "}
            <Button className="bg-primary-100 font-semibold text-xs hidden sm:inline-flex">
              Get Started
            </Button>
          </Link>
          <button
            className="lg:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f8f9ff]/95 backdrop-blur-md flex flex-col items-center py-8 gap-6 lg:hidden border-b border-white/20 shadow-xl">
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

          <Link href="/register">
            Get
            <Button className="bg-primary-100 font-semibold text-xs mt-4 w-[80%] max-w-75">
              Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
