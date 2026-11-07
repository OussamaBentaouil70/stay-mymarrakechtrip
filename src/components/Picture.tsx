import { imageUrl, type Photo } from "../data/site";
import { cn } from "../utils/cn";

/** Responsive, lazy-loaded image with srcset for fast loading on every screen size. */
export function Picture({
  photo,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  priority = false,
  decorative = false,
}: {
  photo: Photo;
  sizes?: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const own = typeof photo.src === "string";
  return (
    <img
      src={imageUrl(photo.src, 1200)}
      srcSet={own ? undefined : [640, 960, 1280, 1920].map((w) => `${imageUrl(photo.src, w)} ${w}w`).join(", ")}
      sizes={own ? undefined : sizes}
      alt={decorative ? "" : photo.alt}
      aria-hidden={decorative || undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
