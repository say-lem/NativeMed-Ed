import Image from "next/image";

/**
 * Two stacked layers for a `fill`+`object-contain` image box: a blurred,
 * oversized `object-cover` copy fills the whole box as a backdrop (so letterbox
 * gaps pick up the image's own colors instead of a flat background), and the
 * real image sits on top fully visible, never cropped. The caller's wrapper
 * must be `relative overflow-hidden` — overflow-hidden clips the oversized blur
 * layer back to the box.
 */
export default function ContainedImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="object-cover object-center scale-125 blur-md opacity-100"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="relative object-contain object-center"
      />
    </>
  );
}
