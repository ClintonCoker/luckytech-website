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

export const heroClips: HeroClip[] = [];
