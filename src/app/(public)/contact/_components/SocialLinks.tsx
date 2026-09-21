"use client";
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io5";
import { TbBrandWhatsapp, TbBrandYoutube } from "react-icons/tb";
import { toast } from "sonner";

const buttonClass =
  "cursor-pointer p-2.25 rounded-full border border-primary-20 hover:border-primary-100 transition-colors";

interface Platform {
  name: string;
  url: string | null;
  icon: React.ReactNode;
}

/** Admin-managed social links (`GET /homepage`). A platform with no URL set yet renders as
 *  a "coming soon" toast instead of a dead/missing link. */
export default function SocialLinks({
  facebookUrl,
  whatsappUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
}: {
  facebookUrl: string | null;
  whatsappUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
}) {
  const comingSoon = (name: string) =>
    toast(`${name} coming soon`, {
      description: "We're not on there yet — follow us on YouTube meanwhile.",
    });

  const platforms: Platform[] = [
    { name: "Instagram", url: instagramUrl, icon: <IoLogoInstagram className="size-5 text-black-others" /> },
    { name: "Facebook", url: facebookUrl, icon: <FiFacebook className="size-5 text-black-others" /> },
    { name: "X (Twitter)", url: twitterUrl, icon: <FiTwitter className="size-5 text-black-others" /> },
    { name: "YouTube", url: youtubeUrl, icon: <TbBrandYoutube className="size-5 text-black-others" /> },
    { name: "WhatsApp", url: whatsappUrl, icon: <TbBrandWhatsapp className="size-5 text-black-others" /> },
  ];

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 md:mt-7">
      {platforms.map((p) =>
        p.url ? (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Native Medical Education on ${p.name} (opens in a new tab)`}
            title={`Follow us on ${p.name}`}
            className={buttonClass}
          >
            {p.icon}
          </a>
        ) : (
          <button
            key={p.name}
            type="button"
            onClick={() => comingSoon(p.name)}
            aria-label={`${p.name} — coming soon`}
            className={buttonClass}
          >
            {p.icon}
          </button>
        ),
      )}
    </div>
  );
}
