"use client";

import Image from "next/image";

const sponsoredCard = {
  label: "Sponsored Story",
  title: "Celebrate a life with a lasting memorial.",
  description:
    "Share photos, memories, and a thoughtful tribute in a presentation designed to feel calm and personal.",
  image: "/Source/Card_Image.jpg",
};

export default function AdvertisementCard() {
  return (
    <article className="relative h-72 overflow-hidden rounded-md border border-black/6 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.09)] transition duration-500 sm:h-80 lg:h-112">
      <Image
        src={sponsoredCard.image}
        alt={sponsoredCard.title}
        fill
        className="object-cover transition duration-700 hover:scale-[1.02]"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0f1724]/90 via-[#0f1724]/60 to-transparent px-5 py-6 sm:px-6">
        <h3 className="font-heading text-[1.5rem] font-semibold leading-tight tracking-[-0.04em] text-[#e8c96b] sm:text-[1.9rem]">
          {sponsoredCard.title}
        </h3>
        <p className="mt-2 font-sans text-sm leading-6 text-white/85">
          {sponsoredCard.description}
        </p>
      </div>
    </article>
  );
}
