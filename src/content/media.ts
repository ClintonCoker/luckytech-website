/**
 * Homepage hero videos. They play one after another with a cross-fade.
 * Files live in public/videos/hero/. Leave the list empty to show the
 * animated device showcase instead.
 */
export interface HeroClip {
  /** Video for computers (about 1280px wide). */
  src: string;
  /** Smaller video for phones (about 720px wide). */
  mobile?: string;
  poster?: string;
  /** Who filmed it and where it's from (for your records; not shown on the site). */
  credit?: string;
}

export const heroClips: HeroClip[] = [
  { src: "/videos/hero/iphone-1280.mp4", mobile: "/videos/hero/iphone-720.mp4", poster: "/videos/hero/iphone-poster.jpg", credit: "Pexels video 14942041 (orange iPhone camera close-up)" },
  { src: "/videos/hero/android-1280.mp4", mobile: "/videos/hero/android-720.mp4", poster: "/videos/hero/android-poster.jpg", credit: "Pexels video 10431047 (Android phone unboxing)" },
  { src: "/videos/hero/case-1280.mp4", mobile: "/videos/hero/case-720.mp4", poster: "/videos/hero/case-poster.jpg", credit: "Pexels video 12742757 (fitting a phone case)" },
  { src: "/videos/hero/gadgets-1280.mp4", mobile: "/videos/hero/gadgets-720.mp4", poster: "/videos/hero/gadgets-poster.jpg", credit: "Pexels video 16457120 (headphones unboxing)" },
];
