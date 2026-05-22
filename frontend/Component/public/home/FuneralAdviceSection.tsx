"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { FuneralAdviceArticle } from "./types";

import AdviceRow from "./AdviceRow";
import {
  rowOneArticles,
  rowTwoArticles,
  rowOneArticlesAdditional,
  rowTwoArticlesAdditional,
  rowOneSponsoredCards,
  rowTwoSponsoredCards,
} from "./data";



export default function FuneralAdviceSection() {
  const [selectedArticle, setSelectedArticle] =
    useState<FuneralAdviceArticle | null>(null);

  return (
    <section className="space-y-8 px-0 py-0">
      <div className="space-y-2">
        <h2 className="font-heading text-[2rem] font-semibold tracking-[-0.03em] text-[#2a4d74] sm:text-[2.45rem]">
          Funeral Advice &amp; Grief Support
        </h2>
        <p className="max-w-3xl font-sans text-[1.02rem] leading-7 text-slate-600 sm:text-[1.08rem]">
          Resources to help with the many needs that arise before and after a
          loss
        </p>
      </div>

      <div className="space-y-6 lg:space-y-7">
        <AdviceRow
          featuredArticle={rowOneArticles[0]}
          faqArticles={[
            ...rowOneArticles.slice(1),
            ...rowOneArticlesAdditional,
          ]}
          sponsoredCards={rowOneSponsoredCards}
          faqTitle="Planning Questions"
          onSelect={setSelectedArticle}
        />

        <AdviceRow
          featuredArticle={rowTwoArticles[0]}
          faqArticles={[
            ...rowTwoArticles.slice(1),
            ...rowTwoArticlesAdditional,
          ]}
          sponsoredCards={rowTwoSponsoredCards}
          faqTitle="Aftercare Questions"
          onSelect={setSelectedArticle}
          reverse
        />
      </div>

      <Dialog
        open={selectedArticle !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null);
        }}
      >
        {selectedArticle ? (
          <DialogContent
            className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-[1rem] border border-[#e2d3bb] bg-[#fbf8f1] p-0 text-[#1a2f46] shadow-[0_30px_90px_rgba(15,23,42,0.25)] sm:w-[92vw] sm:max-w-[92vw] lg:w-[75vw] lg:max-w-[75vw] xl:max-w-6xl"
            showCloseButton
          >
            <div className="max-h-[92vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-md bg-[#f2ede4]">
                  <Image
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    width={1600}
                    height={900}
                    className="h-auto w-full rounded-md object-contain"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </div>

                <DialogHeader className="space-y-3">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.32em] text-[#bb8b37]">
                    {selectedArticle.label}
                  </p>
                  <DialogTitle className="font-heading text-[1.8rem] font-semibold tracking-[-0.035em] text-[#284c73] sm:text-[2.2rem]">
                    {selectedArticle.title}
                  </DialogTitle>
                  <DialogDescription className="max-w-3xl font-sans text-[1rem] leading-7 text-slate-600">
                    {selectedArticle.summary}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 font-sans text-[0.98rem] leading-8 text-slate-700">
                  <p>{selectedArticle.intro}</p>
                  {selectedArticle.sections.map((section) => (
                    <article key={section.heading} className="space-y-2">
                      <h4 className="font-heading text-[1.15rem] font-semibold tracking-[-0.02em] text-[#284c73]">
                        {section.heading}
                      </h4>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </section>
  );
}
