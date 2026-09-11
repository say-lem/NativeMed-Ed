"use client";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube";

/**
 * Click-to-play embed: renders a thumbnail + play button until clicked, then swaps in the
 * iframe. Avoids loading every video's player up front when several are mapped in a grid.
 */
export default function YoutubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-[16px] bg-black">
        <iframe
          src={getYouTubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block w-full aspect-video overflow-hidden rounded-[16px] cursor-pointer"
    >
      <Image
        src={getYouTubeThumbnail(videoId)}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <span className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid place-items-center size-14 sm:size-16 rounded-full bg-primary-100 text-white shadow-lg group-hover:scale-105 transition-transform">
          <Play size={24} fill="white" />
        </span>
      </span>
    </button>
  );
}
