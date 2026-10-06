import ButtonTag from "@/components/shared/ButtonTag";
import TitleCase from "@/components/shared/TitleCase";
import SubtleText from "@/components/shared/SubtleText";
import YoutubeEmbed from "@/components/shared/YoutubeEmbed";
import { getYouTubeVideoId } from "@/lib/youtube";
import type { YoutubeLink } from "@/types/api";

/** Renders one card per entry in `videos` — count is whatever the caller passes, not fixed. */
export default function FeaturedVideos({ videos }: { videos: YoutubeLink[] }) {
  const playable = videos
    .map((video) => ({ ...video, videoId: getYouTubeVideoId(video.url) }))
    .filter(
      (video): video is YoutubeLink & { videoId: string } =>
        video.videoId !== null,
    );

  if (playable.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 md:px-10 lg:px-15 pt-10 sm:pt-14 md:pt-18 lg:pt-24 pb-8 sm:pb-10">
      <div className="text-center mx-auto w-full sm:w-[85%] md:w-[65%] lg:w-[50%] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
        <ButtonTag title="Videos" />
        <TitleCase text="Explore Our Videos" />
        <SubtleText text="SCA guidance, course insights, testimonials, and more from Native Medical Education." />
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
        {playable.map((video) => (
          <div
            key={video._id}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.334rem)] space-y-2 sm:space-y-3"
          >
            <YoutubeEmbed videoId={video.videoId} title={video.title} />
            <p className="font-medium text-sm sm:text-base text-black-others leading-[140%]">
              {video.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
