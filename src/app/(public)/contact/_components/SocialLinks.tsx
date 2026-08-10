"use client";
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io5";
import { TbBrandYoutube } from "react-icons/tb";
import { toast } from "sonner";

const YOUTUBE_URL =
  "https://youtube.com/@nativemedicaleducation?si=D23ouZz5vhRAK-Sn";

const buttonClass =
  "cursor-pointer p-2.25 rounded-full border border-primary-20 hover:border-primary-100 transition-colors";

/** Client component only because the not-yet-live channels need a toast. */
export default function SocialLinks() {
  const comingSoon = (name: string) =>
    toast(`${name} coming soon`, {
      description: "We're not on there yet — follow us on YouTube meanwhile.",
    });

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 md:mt-7">
      <button
        type="button"
        onClick={() => comingSoon("Instagram")}
        aria-label="Instagram — coming soon"
        className={buttonClass}
      >
        <IoLogoInstagram className="size-5 text-black-others" />
      </button>
      <button
        type="button"
        onClick={() => comingSoon("Facebook")}
        aria-label="Facebook — coming soon"
        className={buttonClass}
      >
        <FiFacebook className="size-5 text-black-others" />
      </button>
      <button
        type="button"
        onClick={() => comingSoon("X (Twitter)")}
        aria-label="X (Twitter) — coming soon"
        className={buttonClass}
      >
        <FiTwitter className="size-5 text-black-others" />
      </button>

      {/* The only live channel */}
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Native Medical Education on YouTube (opens in a new tab)"
        title="Watch us on YouTube"
        className={buttonClass}
      >
        <TbBrandYoutube className="size-5 text-black-others" />
      </a>
    </div>
  );
}
