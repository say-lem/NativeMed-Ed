/** Matches the 11-char video id out of watch/short/embed/share-link forms of a YouTube URL. */
const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/;

export function getYouTubeVideoId(url: string): string | null {
  return url.match(YOUTUBE_ID_RE)?.[1] ?? null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** youtube-nocookie.com = privacy-enhanced embed, no tracking cookies until played. */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}
