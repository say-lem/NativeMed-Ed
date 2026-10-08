import Image from "next/image";
import { FooterNavLink } from "../header/NavLink";
import LeaveReviewButton from "./LeaveReviewButton";

export default function Footer() {
  return (
    <>
      {/*
        No negative top margin. It used to pull itself up (-mt-8 … lg:-mt-24, i.e. 96px on
        desktop) to tighten the gap under the home page, which meant EVERY page had to
        out-pad it — and any page whose bottom padding was smaller than the pull-up got the
        black block dragged over its content (this happened to the product cards).

        The footer is now neutral: each page owns the space above it via its own `pb-*`.
        Existing pages had their padding reduced by the same amount, so spacing is unchanged.
      */}
      <footer className="bg-black pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-10 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-8 md:px-10 lg:px-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-6 lg:gap-0">
          <Image
            src={"/Images/main_logo.png"}
            alt="Native Medical Education"
            width={100}
            height={100}
            className="w-20 lg:w-28"
          />

          <nav className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <FooterNavLink href="/" label="Home" />
            <FooterNavLink href="/products" label="Products" />
            <FooterNavLink href="/about" label="About" />
            <FooterNavLink href="/contact" label="Contact" />
            <FooterNavLink href="/legal-disclaimer" label="Legal Disclaimer" />
          </nav>

          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            {/* Newsletter signup — not wired to anything (no form state, no handler, no
             *  backend endpoint). Not being built right now; revisit later — options
             *  discussed: reuse the backend's existing Gmail API sender (gmail.send scope,
             *  src/shared/services/email.service.ts in the Express repo) for a small list,
             *  capped at ~500/day on a personal account, or move to a dedicated ESP
             *  (Resend/Mailchimp/Brevo) once the list needs to scale or wants proper
             *  unsubscribe/compliance handling. */}
            {/* <h3 className="font-medium text-base sm:text-lg lg:text-2xl leading-[140%] tracking-[-2%] text-white w-full md:w-[90%] lg:w-[85%] capitalize">
              Stay up to date with our latest news & Classes
            </h3>
            <aside className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="email"
                className="border-[0.5px] px-3 sm:px-4 py-2.5 sm:py-3 flex-1 rounded-[8px] text-white text-sm lg:text-base min-w-0"
                placeholder="Enter your Email"
              />
              <Button className="">Sign Me Up</Button>
            </aside> */}
            <LeaveReviewButton />
          </div>
        </div>
      </footer>

      <div className="border-t border-subtle-text bg-black py-4 sm:py-6 lg:py-8 text-center px-4 space-y-2 sm:space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <FooterNavLink href="/terms-and-conditions" label="Terms & Conditions" />
          <FooterNavLink href="/privacy-policy" label="Privacy Policy" />
        </div>
        <p className="leading-6 tracking-[-0.31px] text-subtle-text text-xs sm:text-sm lg:text-base">
          © 2026 Native Medical Education. All rights reserved.
        </p>
      </div>
    </>
  );
}
