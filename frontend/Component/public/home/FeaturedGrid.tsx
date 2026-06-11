"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import type { ObituaryMock } from "../../../lib/mockData";

import ResponsiveCarousel from "./ResponsiveCarousel";

type Advertisement = {
  label: string;
  title: string;
  description: string;
  image: string;
  link?: string | null;
};

const advertisement: Advertisement = {
  label: "Sponsored Story",
  title: "Celebrate a life beautifully.",
  description:
    "Showcase a memorial with a dedicated banner, preserved memories, and a timeless presentation that feels personal on every device.",
  image: "/Source/Card_Image.jpg",
  // link: "/profile/create",
};

/**
 * Converts user-provided ad links into valid external URLs.
 *
 * Examples:
 * "www.google.com"       -> "https://www.google.com"
 * "google.com"           -> "https://google.com"
 * "https://google.com"   -> "https://google.com"
 * "/profile/create"      -> "/profile/create"
 */
function normalizeAdLink(link?: string | null) {
  if (!link) return null;

  const trimmedLink = link.trim();

  if (!trimmedLink) return null;

  const isInternalLink = trimmedLink.startsWith("/");
  const hasProtocol =
    trimmedLink.startsWith("http://") || trimmedLink.startsWith("https://");

  if (isInternalLink || hasProtocol) {
    return trimmedLink;
  }

  return `https://${trimmedLink}`;
}

/**
 * Renders the featured obituary grid.
 *
 * @param {object} props - Component props.
 * @param {ObituaryMock[]} props.items - Obituaries to render.
 * @param {Advertisement} [props.ad] - Dynamic ad to render.
 * @returns {JSX.Element} The featured grid.
 */
export default function FeaturedGrid({
  items,
  ad,
}: {
  items: ObituaryMock[];
  ad?: any;
}) {
  // console.log("FeaturedGrid items:", items);
  const todaysObituaries = items.filter((obituary) => {
    const today = new Date();
    const deathDate = new Date(obituary.dateOfDeath);
    return (
      deathDate.getDate() === today.getDate() &&
      deathDate.getMonth() === today.getMonth()
    );
  });
  // console.log("Today's obituaries:", todaysObituaries);
  const displayAd: Advertisement = ad
    ? {
        label: ad.placementType || "Sponsored",
        title: ad.adTitle || "",
        description: ad.adDescription || "",
        image: ad.adImageUrl || advertisement.image,
        link: ad.adLinkUrl || null,
      }
    : advertisement;

  return (
    <div className="grid gap-6 lg:grid-cols-4 lg:items-stretch">
      <div className="min-w-0 p-4 lg:col-span-3 lg:p-5">
        {todaysObituaries.length > 0 ? (
          <ResponsiveCarousel items={todaysObituaries} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <p className="text-center text-lg font-medium text-gray-500">
              In this date there are no featured obituaries. Please check back tomorrow!
            </p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <SponsoredAdvertisement item={displayAd} />
      </div>
    </div>
  );
}

function SponsoredAdvertisement({ item }: { item: Advertisement }) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const normalizedLink = normalizeAdLink(item.link);

  const handleRipple = (
    event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const ripple = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setRipples((currentRipples) => [...currentRipples, ripple]);

    window.setTimeout(() => {
      setRipples((currentRipples) =>
        currentRipples.filter((entry) => entry.id !== ripple.id),
      );
    }, 720);
  };

  const cardClasses =
    "relative flex min-h-112 w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-[#e6c08a] bg-[#f3d8aa] text-left transition duration-500";

  const content = (
    <>
      <Image
        src={item.image}
        alt={item.title || "Advertisement"}
        fill
        className="object-cover transition duration-700 hover:scale-[1.03]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,15,0.06)_0%,rgba(8,11,15,0.16)_42%,rgba(8,11,15,0.72)_100%)]" />

      <div className="absolute inset-0">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="animate-waterdrop absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <div className="w-full max-w-full space-y-3 rounded-[1.35rem] bg-black/12 p-4 text-white backdrop-blur-[1px] sm:max-w-88 sm:p-5">
          <h3 className="font-heading text-3xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-[2.2rem]">
            {item.title}
          </h3>

          <p className="font-sans text-sm leading-6 text-white/88">
            {item.description}
          </p>
        </div>
      </div>
    </>
  );

  if (normalizedLink) {
    return (
      <a
        href={normalizedLink}
        target="_blank"
        rel="noopener noreferrer"
        onPointerDown={handleRipple}
        className={cardClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onPointerDown={handleRipple} className={cardClasses}>
      {content}
    </button>
  );
}
