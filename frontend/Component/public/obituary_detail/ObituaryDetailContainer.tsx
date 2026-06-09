"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaDiscord,
  FaFacebookF,
  FaFacebookMessenger,
  FaEnvelope,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
  FaWeixin,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import { useAxios } from "../../../context/AxiosProvider";
import { mockObituaries, type ObituaryMock } from "../../../lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

import CondolenceSection from "./CondolenceSection";
import funeralLogo from "./funeralLogo.png";

const AUTO_DELAY = 2200;
const VISIBLE_SLIDES = 3;
const TRIBUTE_IMAGES = {
  candle: "https://pngimg.com/uploads/candle/candle_PNG7305.png",
  flower:
    "https://www.pngmart.com/files/17/Wreath-Funeral-Flowers-Transparent-Background.png",
} as const;

type TributeType = keyof typeof TRIBUTE_IMAGES;

type TributeItem = {
  id: string;
  type: TributeType;
  text: string;
};

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

function getObituaryParagraph(item: ObituaryMock): string {
  return (
    item.biography ??
    `${item.deceasedFirstName} ${item.deceasedLastName} lived a life marked by steady kindness, quiet strength, and a deep devotion to the people they loved. They were the person family and friends turned to for comfort, practical advice, and a reassuring word when the days felt heavy. Their home was a place of welcome, warmth, and easy conversation, where visitors were always received with patience and care. Through years filled with ordinary routines and unforgettable milestones, they created a legacy of compassion, resilience, and generosity that will remain with their family for generations. Their memory will continue to live on in the stories shared, the lessons taught, and the love they gave so freely to everyone around them.`
  );
}

function getGoogleMapsUrl(city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city} funeral home`)}`;
}

function getTributeLabel(type: TributeType): string {
  return type === "candle" ? "Candle" : "Flower";
}

function buildSlides(images: string[]): string[] {
  if (images.length === 0) {
    return [];
  }

  if (images.length >= VISIBLE_SLIDES) {
    return images;
  }

  const slides = [...images];
  while (slides.length < VISIBLE_SLIDES) {
    slides.push(images[slides.length % images.length]);
  }

  return slides;
}

function ObituaryImageCarousel({ images }: { images: string[] }) {
  const slides = useMemo(() => buildSlides(images), [images]);

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const restartTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_DELAY);
  }, [nextSlide]);

  useEffect(() => {
    if (!slides.length) return;

    restartTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [slides.length, restartTimer]);

  if (!slides.length) return null;

  return (
    <>
      {/* DESKTOP SLIDER */}
      <div className="relative mx-auto hidden w-full max-w-7xl overflow-hidden py-14 md:block">
        {/* LEFT BUTTON */}
        <button
          type="button"
          onClick={() => {
            prevSlide();
            restartTimer();
          }}
          className="absolute left-4 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200/90 text-5xl text-slate-700 transition-all duration-300 hover:scale-105 hover:bg-neutral-300"
        >
          ‹
        </button>

        {/* RIGHT BUTTON */}
        <button
          type="button"
          onClick={() => {
            nextSlide();
            restartTimer();
          }}
          className="absolute right-4 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200/90 text-5xl text-slate-700 transition-all duration-300 hover:scale-105 hover:bg-neutral-300"
        >
          ›
        </button>

        {/* DESKTOP TRACK */}
        <div className="relative h-160 overflow-hidden">
          <div
            className="flex h-full items-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(calc(50% - ${
                current * 33.333 + 16.666
              }%))`,
            }}
          >
            {slides.map((image, index) => {
              const isActive = index === current;

              return (
                <div
                  key={`${image}-${index}`}
                  className={`w-1/3 shrink-0 transition-all duration-700 ${
                    isActive
                      ? "z-30 scale-100 opacity-100"
                      : "z-10 scale-[0.72] opacity-55"
                  }`}
                >
                  <div
                    className={`relative mx-auto overflow-hidden rounded-[34px] transition-all duration-700 ${
                      isActive ? "h-155 w-107.5" : "h-125 w-85"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Slide ${index + 1}`}
                      fill
                      priority={isActive}
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE SLIDER */}
      <div className="relative mx-auto block w-full overflow-hidden py-8 md:hidden">
        {/* TOP BUTTON */}
        <button
          type="button"
          onClick={() => {
            prevSlide();
            restartTimer();
          }}
          className="absolute left-1/2 top-4 z-50 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-200/90 text-3xl text-slate-700"
        >
          ‹
        </button>

        {/* BOTTOM BUTTON */}
        <button
          type="button"
          onClick={() => {
            nextSlide();
            restartTimer();
          }}
          className="absolute bottom-4 left-1/2 z-50 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-200/90 text-3xl text-slate-700"
        >
          ›
        </button>

        <div className="relative h-130 overflow-hidden">
          {slides.map((image, index) => {
            const isActive = index === current;

            return (
              <div
                key={`${image}-${index}`}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "translate-y-0 opacity-100 z-30"
                    : index < current
                      ? "-translate-y-full opacity-0 z-10"
                      : "translate-y-full opacity-0 z-10"
                }`}
              >
                <div className="relative mx-auto h-full w-[92%] overflow-hidden rounded-[30px]">
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={isActive}
                    sizes="100vw"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function ObituaryDetailContainer({
  id,
}: ObituaryDetailContainerProps) {
  const [item, setItem] = useState<ObituaryMock | null>(null);
  const [isFamilyTreeOpen, setIsFamilyTreeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isTributeOpen, setIsTributeOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [tributes, setTributes] = useState<TributeItem[]>([]);
  const [tributeType, setTributeType] = useState<TributeType>("candle");
  const [tributeText, setTributeText] = useState("");
  const [tributeName, setTributeName] = useState("");
  const [tributeEmail, setTributeEmail] = useState("");
  const [isSubmittingTribute, setIsSubmittingTribute] = useState(false);

  const api = useAxios();

  useEffect(() => {
    const fetchMemorial = async () => {
      try {
        const res = await api.get(`/memorials/${id}`);
        const m = res.data.memorial;
        if (m) {
          setItem({
            id: m._id,
            name: m.name,
            deceasedFirstName: m.name.split(" ")[0],
            deceasedLastName: m.name.split(" ").slice(1).join(" "),
            dateOfBirth: m.birthdate || "",
            dateOfDeath: m.deathDate || "",
            location: {
              country: m.country,
              city: m.location ? m.location.split(",")[0] : "",
              state: ""
            },
            images: m.deadPersonPhoto || [],
            image: m.deadPersonPhoto?.[0] || "/Source/Placeholder_Person.png",
            description: m.memorialDetails,
            biography: m.memorialDetails,
            excerpt: m.memorialDetails,
            headline: m.lifeStory || m.memorialDetails || "In Loving Memory",
          } as ObituaryMock);
        }
      } catch (err) {
        console.error("Failed to fetch memorial:", err);
      }
    };
    fetchMemorial();
  }, [id, api]);

  useEffect(() => {
    const fetchCondolences = async () => {
      try {
        const res = await api.get(`/condolences/${id}`);
        const data = res.data.condolences || [];
        setTributes(data.map((c: any) => ({
          id: c._id,
          type: c.type,
          text: c.message
        })));
      } catch (err) {
        console.error("Failed to fetch condolences:", err);
      }
    };
    fetchCondolences();
  }, [id, api]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareTitle = item
    ? `${item.deceasedFirstName} ${item.deceasedLastName}`
    : "Memorial page";
  const shareText = `View the memorial page for ${shareTitle}`;
  const encodedShareUrl = encodeURIComponent(shareUrl || "");
  const encodedShareText = encodeURIComponent(shareText);
  const detailImages = useMemo(
    () => buildSlides(item?.images ?? []).slice(0, 3),
    [item],
  );

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

  const handleAddTribute = async () => {
    const text = tributeText.trim();

    if (!text || !tributeName.trim() || !tributeEmail.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmittingTribute(true);
    try {
      const res = await api.post(`/condolences/${id}`, {
        submitterEmail: tributeEmail,
        submitterName: tributeName,
        message: text,
        type: tributeType
      });
      setTributes((current) => [
        {
          id: res.data.condolence._id,
          type: tributeType,
          text,
        },
        ...current,
      ]);
      setTributeText("");
      setTributeName("");
      setTributeEmail("");
      setTributeType("candle");
      setIsTributeOpen(false);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
         alert(err.response.data.message);
      } else {
         alert("Failed to submit tribute. Please try again.");
      }
    } finally {
      setIsSubmittingTribute(false);
    }
  };

  if (!item) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-slate-600">
        Loading memorial details...
      </div>
    );
  }

  return (
    <main className="min-h-screen text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto lg:space-y-10">
        <section className="space-y-5 text-center">
          <div className="flex justify-center">
            <Image
              src={funeralLogo}
              alt="Funeral home logo"
              priority
              className="h-auto w-full max-w-5xl object-contain"
            />
          </div>

          <ObituaryImageCarousel images={item.images} />

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

        <section className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="rounded-[14px] border border-black/10 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="font-serif text-2xl tracking-tight text-slate-900 sm:text-[2rem]">
                Obituary
              </h2>
              <p className="mt-4 max-w-none text-[15px] leading-8 tracking-[0.01em] text-slate-600 sm:text-[16px]">
                It is with deep sorrow that we announce the passing of Jhon
                Smith, a gifted guitarist, beloved friend, and cherished soul,
                who left this world peacefully on May 20, 2026, at the age of
                62. His departure marks the end of a remarkable journey filled
                with music, love, and inspiration that touched countless lives.
                Born on March 14, 1964, in Austin, Texas, Jhon discovered his
                passion for music at an early age. By the time he was ten, he
                was already strumming his first guitar, a gift from his father,
                and experimenting with melodies that would later define his
                career. His teenage years were spent immersed in the vibrant
                local music scene, where he quickly earned a reputation as a
                prodigy with an extraordinary ability to blend classical
                precision with soulful improvisation.
              </p>
            </div>
            <div className="rounded-[14px] border border-black/10 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="font-serif text-2xl tracking-tight text-slate-900 sm:text-[1.9rem]">
                Watson’s Funeral Home - {item.location.city}
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div className="space-y-4 text-[15px] leading-7 text-[#cc5f0b]">
                  <p>North Circular Road,</p>
                  <p>{item.location.city},</p>
                  <p>V92 FX76,</p>
                  <p>{item.location.country ?? "Kerry"}</p>
                </div>
                <div className="space-y-4 text-[15px] leading-7 text-[#cc5f0b]">
                  <p className="flex items-center gap-3">
                    <FaGlobeAmericas className="h-4 w-4 shrink-0" />
                    <span>hogansfuneralhome.com</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaEnvelope className="h-4 w-4 shrink-0" />
                    <span>hogansfuneralhome@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaPhoneAlt className="h-4 w-4 shrink-0" />
                    <span>066-7121119</span>
                  </p>
                </div>
              </div>
              <a
                href={getGoogleMapsUrl(item.location.city)}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#cc5f0b] px-6 py-3 text-sm font-semibold text-[#cc5f0b] transition hover:bg-[#fff4eb]"
              >
                View Funeral Home Map
                <FaMapMarkerAlt className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-4 lg:w-60 lg:flex-none">
            {detailImages.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={image}
                target="_blank"
                rel="noreferrer noopener"
                className="group block overflow-hidden rounded-[14px] border border-black/5 bg-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)]"
              >
                <div className="relative aspect-4/3 w-full">
                  <Image
                    src={image}
                    alt={`Memorial image ${index + 1}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </a>
            ))}
          </div>
        </section>
        {/* FUNERAL SERVICE SECTION */}
        <section className="mx-auto max-w-6xl rounded-[22px]   py-6  sm:py-7">
          {/* TITLE */}
          <h2 className="font-serif text-3xl text-[#1f1630] sm:text-4xl">
            Funeral notice of {item.deceasedFirstName} {item.deceasedLastName}
          </h2>

          {/* DONATION CARD */}
          <div className="mt-8 rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-5">
            <p className=" font-serif text-lg leading-7 text-[#2b2137]">
              In memory of {item.deceasedFirstName}, donations will be directed
              to trusted charitable causes that reflect their values and bring
              comfort to others. Your gift will help make a meaningful
              difference.
            </p>

            <button
              type="button"
              onClick={() => setIsDonateOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#cf142b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b81125]"
            >
              <span className="text-base">♡</span>
              Donate
            </button>
          </div>

          {/* SERVICE BOXES */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {/* SERVICE */}
            <div className="rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-5">
              <h3 className="font-serif text-xl font-semibold text-[#2b2137]">
                Service
              </h3>

              <div className="mt-7 space-y-5 text-[#2b2137]">
                {/* DATE */}
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="mt-0.5 h-5 w-5 text-[#2b2137]" />
                  <p className="text-sm">9 April 2025</p>
                </div>

                {/* TIME */}
                <div className="flex items-start gap-3">
                  <FaClock className="mt-0.5 h-5 w-5 text-[#2b2137]" />
                  <p className="text-sm">2:00 PM</p>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-0.5 h-5 w-5 text-[#2b2137]" />

                  <p className="text-sm leading-6">
                    St Mary Magdalene Church,
                    <br />
                    Pulham Market,
                    <br />
                    Diss, Norfolk,
                    <br />
                    United Kingdom
                  </p>
                </div>
              </div>

              {/* DIRECTION BUTTON */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    "https://maps.google.com/?q=St+Mary+Magdalene+Church+Pulham+Market",
                    "_blank",
                  )
                }
                className="mt-6 text-sm font-semibold text-[#a46a3d] transition hover:text-[#8a562c]"
              >
                Get directions
              </button>
            </div>

            {/* RECEPTION */}
            <div className="rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-5">
              <h3 className="font-serif text-xl font-semibold text-[#2b2137]">
                Reception
              </h3>

              <div className="mt-7 space-y-5 text-[#2b2137]">
                {/* DATE */}
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="mt-0.5 h-5 w-5 text-[#2b2137]" />
                  <p className="text-sm">9 April 2025</p>
                </div>

                {/* TIME */}
                <div className="flex items-start gap-3">
                  <FaClock className="mt-0.5 h-5 w-5 text-[#2b2137]" />
                  <p className="text-sm">2:30 PM</p>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-0.5 h-5 w-5 text-[#2b2137]" />

                  <p className="text-sm leading-6">
                    The Crown Inn,
                    <br />
                    Pulham Market,
                    <br />
                    Diss, Norfolk,
                    <br />
                    United Kingdom
                  </p>
                </div>
              </div>

              {/* DIRECTION BUTTON */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    "https://maps.google.com/?q=The+Crown+Inn+Pulham+Market",
                    "_blank",
                  )
                }
                className="mt-8 text-lg font-semibold text-[#a46a3d] transition hover:text-[#8a562c]"
              >
                Get directions
              </button>
            </div>
          </div>
        </section>

        {/* DONATION MODAL */}
        <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-225 sm:max-w-150 rounded-[28px] border-0 p-0 overflow-hidden">
            <div className="bg-white p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl text-[#1f1630]">
                  Donate in Their Memory
                </DialogTitle>

                <DialogDescription className="pt-2 text-base leading-7 text-slate-600">
                  All donations will be directed to charitable causes chosen to
                  honor {item.deceasedFirstName}'s memory.
                </DialogDescription>
              </DialogHeader>

              {/* DONATION AMOUNTS */}
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-800 transition hover:border-[#274877] hover:bg-[#f5f8fc]"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* CUSTOM AMOUNT */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Custom Amount
                </label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[#274877]"
                />
              </div>

              {/* CARD DETAILS */}
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[#274877]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[#274877]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expiry
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[#274877]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="123"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-[#274877]"
                    />
                  </div>
                </div>
              </div>

              {/* PAY BUTTON */}
              <button
                type="button"
                className="mt-7 h-13 w-full rounded-xl bg-[#274877] text-lg font-semibold text-white transition hover:bg-[#1f3a60]"
              >
                Complete Donation
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <section className="mx-auto max-w-6xl rounded-[26px] bg-[#fbf7f1] px-4 py-6 sm:px-6 sm:py-8">
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsTributeOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
            >
              <span className="inline-block text-lg leading-none">◌</span>
              Leave a Tribute
            </button>
          </div>

          {/* GALLERY */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-10">
            {tributes.map((tribute) => (
              <article
                key={tribute.id}
                className="w-full max-w-60 sm:w-[46%] lg:w-[30%]"
              >
                {/* IMAGE CARD */}
                <div className="group max-w-40 mx-auto relative overflow-hidden rounded-[12px] ">
                  {/* MAIN IMAGE */}
                  <div className="relative aspect-3/3 w-full overflow-hidden rounded-[12px]">
                    <Image
                      src={TRIBUTE_IMAGES[tribute.type]}
                      alt={`${getTributeLabel(tribute.type)} tribute`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* DARK FADE */}
                    <div className="absolute inset-0 " />

                    {/* FLOWER OVERLAY */}
                    <img
                      src="https://png.pngtree.com/png-clipart/20230428/original/pngtree-watercolor-white-flower-bouquet-transparent-png-image_9118510.png"
                      alt=""
                      className="pointer-events-none absolute bottom-0 left-0 w-28 opacity-45"
                    />

                    {/* CANDLE OVERLAY */}
                    <img
                      src="https://pngimg.com/d/candle_PNG50074.png"
                      alt=""
                      className="pointer-events-none absolute bottom-2 right-2 w-16 opacity-40"
                    />
                  </div>
                </div>

                {/* TEXT */}
                <p className="mt-3 text-center font-serif text-[19px] leading-6 tracking-tight text-slate-900">
                  {tribute.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={isFamilyTreeOpen} onOpenChange={setIsFamilyTreeOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-5xl p-0 sm:max-w-5xl">
          <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle>
                Family Tree of {item.deceasedFirstName} {item.deceasedLastName}
              </DialogTitle>
              <DialogDescription>
                Visual family tree image for {item.deceasedFirstName}{" "}
                {item.deceasedLastName}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5 rounded-3xl border border-slate-200 bg-[#f8f2e8] p-4 shadow-inner">
              <img
                src={`https://th.bing.com/th/id/R.18622bd08a871bc6ea8c5029af1805d5?rik=mqlB%2by9jOPnWmA&pid=ImgRaw&r=0`}
                alt={`Family tree of ${item.deceasedFirstName} ${item.deceasedLastName}`}
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

      <Dialog open={isTributeOpen} onOpenChange={setIsTributeOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-xl p-0 sm:max-w-xl">
          <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white px-5 py-5 sm:px-6 sm:py-6">
            <DialogHeader>
              <DialogTitle>Add Tribute</DialogTitle>
              <DialogDescription>
                Choose a candle or flower tribute and write a condolence note.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Your Name
                </label>
                <input
                  type="text"
                  value={tributeName}
                  onChange={(event) => setTributeName(event.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Your Email
                </label>
                <input
                  type="email"
                  value={tributeEmail}
                  onChange={(event) => setTributeEmail(event.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tribute type
                </label>
                <select
                  value={tributeType}
                  onChange={(event) =>
                    setTributeType(event.target.value as TributeType)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                >
                  <option value="candle">Candle</option>
                  <option value="flower">Flower</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Condolence text
                </label>
                <textarea
                  value={tributeText}
                  onChange={(event) => setTributeText(event.target.value)}
                  placeholder="Write your condolence message"
                  className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTributeOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingTribute}
                  onClick={handleAddTribute}
                  className="rounded-full bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60] disabled:opacity-50"
                >
                  {isSubmittingTribute ? "Adding..." : "Add Tribute"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
