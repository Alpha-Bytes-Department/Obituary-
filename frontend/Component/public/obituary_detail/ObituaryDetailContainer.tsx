"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  FaDiscord,
  FaFacebookF,
  FaFacebookMessenger,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
  FaWeixin,
} from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import {
  mockObituaries,
  type FamilyRelation,
  type ObituaryMock,
} from "../../../lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

import CondolenceSection from "./CondolenceSection";
import ImageSlider from "./ImageSlider";
import funeralLogo from "./funeralLogo.png";

interface ObituaryDetailContainerProps {
  id: string;
}

function formatDate(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createFamilyTreeImage(
  fullName: string,
  relations: FamilyRelation[],
): string {
  const visibleRelations = relations.slice(0, 6);
  const columns = visibleRelations.length > 2 ? 2 : 1;
  const cardWidth = columns === 1 ? 620 : 280;
  const cardHeight = 86;
  const gapY = 28;
  const startY = 245;
  const rows = Math.max(
    1,
    Math.ceil(Math.max(visibleRelations.length, 1) / columns),
  );
  const width = columns === 1 ? 720 : 700;
  const height = startY + rows * (cardHeight + gapY) + 64;
  const rootX = width / 2;
  const rootY = 104;
  const rootWidth = 360;
  const rootHeight = 120;
  const leftX = columns === 1 ? (width - cardWidth) / 2 : 64;
  const rightX = columns === 1 ? leftX : width - cardWidth - 64;

  const cards = visibleRelations
    .map((relation, index) => {
      const column = columns === 1 ? 0 : index % 2;
      const row = columns === 1 ? index : Math.floor(index / 2);
      const x = columns === 1 ? leftX : column === 0 ? leftX : rightX;
      const y = startY + row * (cardHeight + gapY);
      const centerX = x + cardWidth / 2;
      const startLineY = rootY + rootHeight / 2;
      const endLineY = y;
      const relationName = escapeXml(relation.name);
      const relationType = escapeXml(relation.relation);

      return `
        <line x1="${rootX}" y1="${startLineY}" x2="${centerX}" y2="${endLineY}" stroke="#c9b9a4" stroke-width="3" stroke-linecap="round" />
        <rect x="${x}" y="${y}" rx="22" ry="22" width="${cardWidth}" height="${cardHeight}" fill="#fffaf2" stroke="#d8c9b4" stroke-width="2" />
        <text x="${x + 24}" y="${y + 35}" fill="#1f2937" font-size="20" font-weight="700" font-family="Georgia, serif">${relationName}</text>
        <text x="${x + 24}" y="${y + 62}" fill="#8b6f47" font-size="16" font-weight="500" font-family="Inter, Arial, sans-serif">${relationType}</text>
      `;
    })
    .join("");

  const emptyState =
    visibleRelations.length === 0
      ? `
        <rect x="${(width - cardWidth) / 2}" y="${startY}" rx="22" ry="22" width="${cardWidth}" height="${cardHeight}" fill="#fffaf2" stroke="#d8c9b4" stroke-width="2" />
        <text x="${width / 2}" y="${startY + 36}" text-anchor="middle" fill="#1f2937" font-size="20" font-weight="700" font-family="Georgia, serif">No family tree data</text>
        <text x="${width / 2}" y="${startY + 62}" text-anchor="middle" fill="#8b6f47" font-size="16" font-weight="500" font-family="Inter, Arial, sans-serif">Add relations to display the family tree</text>
      `
      : cards;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
      <title>Family tree for ${escapeXml(fullName)}</title>
      <desc>A decorative family tree diagram for the memorial page.</desc>
      <rect width="100%" height="100%" fill="#f8f2e8" />
      <circle cx="${width / 2 - 170}" cy="72" r="44" fill="#274877" opacity="0.08" />
      <circle cx="${width / 2 + 180}" cy="110" r="58" fill="#274877" opacity="0.06" />
      <rect x="${(width - rootWidth) / 2}" y="${rootY}" rx="28" ry="28" width="${rootWidth}" height="${rootHeight}" fill="#274877" />
      <text x="${rootX}" y="${rootY + 46}" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="700" font-family="Georgia, serif">Family Tree</text>
      <text x="${rootX}" y="${rootY + 76}" text-anchor="middle" fill="#dfe8f7" font-size="16" font-weight="500" font-family="Inter, Arial, sans-serif">${escapeXml(fullName)}</text>
      ${emptyState}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Renders the obituary detail page.
 *
 * @param {ObituaryDetailContainerProps} props - Component props.
 * @returns {JSX.Element} The obituary detail view.
 */
export default function ObituaryDetailContainer({
  id,
}: ObituaryDetailContainerProps) {
  const [item, setItem] = useState<ObituaryMock | null>(null);
  const [isFamilyTreeOpen, setIsFamilyTreeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mockItem = mockObituaries.find((entry) => entry.id === id);
    setItem(mockItem ?? mockObituaries[0] ?? null);
  }, [id]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const familyTreeImage = useMemo(() => {
    if (!item) {
      return "";
    }

    return createFamilyTreeImage(
      `${item.deceasedFirstName} ${item.deceasedLastName}`,
      item.familyTree ?? [],
    );
  }, [item]);

  const shareTitle = item
    ? `${item.deceasedFirstName} ${item.deceasedLastName}`
    : "Memorial page";
  const shareText = `View the memorial page for ${shareTitle}`;
  const encodedShareUrl = encodeURIComponent(shareUrl || "");
  const encodedShareText = encodeURIComponent(shareText);

  const openShareUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!item) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-slate-600">
        Loading memorial details...
      </div>
    );
  }

  return (
    <main className="min-h-screen  px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto  space-y-10">
        <section className="space-y-5 text-center">
          <div className="flex justify-center">
            <Image
              src={funeralLogo}
              alt="Funeral home logo"
              priority
              className="h-16 w-full object-contain sm:h-20"
            />
          </div>

          <ImageSlider images={item.images} />

          <div className="space-y-2 pt-1">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#304d7a] sm:text-4xl">
              {item.deceasedFirstName} {item.deceasedLastName}
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              {formatDate(item.dateOfBirth)} - {formatDate(item.dateOfDeath)}
            </p>
            <p className="text-sm text-slate-500 sm:text-base">
              {item.location.city}
              {item.location.state ? `, ${item.location.state}` : ""}
              {item.location.country ? `, ${item.location.country}` : ""}
            </p>
            <p className="mx-auto max-w-2xl px-4 font-serif text-base italic leading-7 text-slate-600 sm:text-lg">
              &ldquo;{item.memorialQuote ?? item.excerpt}&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFamilyTreeOpen(true)}
              className="inline-flex min-w-36 items-center justify-center rounded-lg bg-[#274877] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f3a60]"
            >
              Family Tree
            </button>
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="inline-flex min-w-36 items-center justify-center rounded-lg border border-[#274877] bg-white px-5 py-3 text-sm font-semibold text-[#274877] shadow-sm transition hover:bg-[#f4f7fb]"
            >
              Share
            </button>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Obituary
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {item.biography ?? item.excerpt}
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Family tree
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Open the modal to view the full family tree image.
            </p>
            <button
              type="button"
              onClick={() => setIsFamilyTreeOpen(true)}
              className="mt-5 inline-flex rounded-full bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
            >
              View Family Tree
            </button>
          </div>
        </section>

        <CondolenceSection obituaryId={id} />
      </div>

      <Dialog open={isFamilyTreeOpen} onOpenChange={setIsFamilyTreeOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-5xl p-0 sm:max-w-5xl">
          <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle>Family Tree</DialogTitle>
              <DialogDescription>
                Visual family tree image for {item.deceasedFirstName}{" "}
                {item.deceasedLastName}.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-[#f8f2e8] p-4 shadow-inner">
              <img
                src={familyTreeImage}
                alt="Family tree image"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-135 p-0 sm:max-w-135">
          <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white px-5 py-4 sm:px-6 sm:py-5">
            <DialogHeader className="flex-row items-center justify-between gap-4">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Share
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 border-t border-slate-200 pt-5">
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  {
                    label: "Twitter",
                    icon: FaTwitter,
                    bg: "bg-sky-50 text-[#1d9bf0]",
                    onClick: () =>
                      openShareUrl(
                        `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`,
                      ),
                  },
                  {
                    label: "Facebook",
                    icon: FaFacebookF,
                    bg: "bg-blue-50 text-[#1877f2]",
                    onClick: () =>
                      openShareUrl(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
                      ),
                  },
                  {
                    label: "Reddit",
                    icon: FaRedditAlien,
                    bg: "bg-orange-100 text-[#ff4500]",
                    onClick: () =>
                      openShareUrl(
                        `https://www.reddit.com/submit?url=${encodedShareUrl}&title=${encodedShareText}`,
                      ),
                  },
                  {
                    label: "Discord",
                    icon: FaDiscord,
                    bg: "bg-slate-200 text-[#5865f2]",
                    onClick: () =>
                      openShareUrl(`https://discord.com/channels/@me`),
                  },
                  {
                    label: "Whatsapp",
                    icon: FaWhatsapp,
                    bg: "bg-emerald-100 text-[#25d366]",
                    onClick: () =>
                      openShareUrl(
                        `https://wa.me/?text=${encodedShareText}%20${encodedShareUrl}`,
                      ),
                  },
                  {
                    label: "Messenger",
                    icon: FaFacebookMessenger,
                    bg: "bg-indigo-100 text-[#006aff]",
                    onClick: () => openShareUrl(`https://www.messenger.com/`),
                  },
                  {
                    label: "Telegram",
                    icon: FaTelegramPlane,
                    bg: "bg-sky-100 text-[#229ed9]",
                    onClick: () =>
                      openShareUrl(
                        `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareText}`,
                      ),
                  },
                  {
                    label: "WeChat",
                    icon: FaWeixin,
                    bg: "bg-lime-100 text-[#07c160]",
                    onClick: () => openShareUrl(`https://www.wechat.com/`),
                  },
                ].map(({ label, icon: Icon, bg, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${bg}`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="text-sm text-slate-700">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Page Link
                  </p>
                  <span className="text-xs font-semibold text-[#ff5a1f]">
                    {copied ? "link copied" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-md bg-[#ece7e6] px-4 py-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition hover:bg-white"
                    aria-label="Copy link"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="button" onClick={() => setIsShareOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
