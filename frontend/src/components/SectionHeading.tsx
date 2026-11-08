import Reveal, { type RevealDirection } from "./Reveal";
import { useContent } from "../store/content";
import { FormattedText } from "./FormattedText";

type SectionHeadingProps = {
  watermark: string;
  title: string;
  subtitle?: string;
  direction?: RevealDirection;
  sectionId?: string;
};

/**
 * Signature section header: a giant faint uppercase watermark centered behind
 * a solid white heading, with a small gray subtitle underneath.
 * Title and watermark can be dynamically overridden from admin panel via sectionId.
 */
export default function SectionHeading({
  watermark,
  title,
  subtitle,
  direction = "down",
  sectionId,
}: SectionHeadingProps) {
  const { content } = useContent();
  const effectiveTitle = (sectionId && content.settings.sectionNames?.[sectionId]) || title;
  const effectiveWatermark = (sectionId && content.settings.sectionWatermarks?.[sectionId]) || watermark;

  return (
    <Reveal direction={direction} distance={30} className="relative mb-16 select-none text-center md:mb-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] whitespace-nowrap font-display text-[24vw] font-extrabold uppercase leading-none tracking-tight text-neutral-500 opacity-10 sm:text-[18vw] lg:text-[10rem]"
      >
        {effectiveWatermark}
      </span>
      <h2 className="relative z-10 font-display text-4xl font-bold text-white sm:text-5xl">
        <FormattedText text={effectiveTitle} />
      </h2>
      {subtitle ? (
        <p className="relative z-10 mt-4 text-sm text-gray-400 sm:text-base">
          <FormattedText text={subtitle} />
        </p>
      ) : null}
    </Reveal>
  );
}
