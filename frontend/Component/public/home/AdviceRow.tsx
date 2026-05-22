"use client";

import React from "react";
import ArticlePreviewCard from "./ArticlePreviewCard";
import FaqRail from "./FaqRail";
import SponsoredCardView from "./SponsoredCardView";
import { FuneralAdviceArticle, SponsoredCard } from "./types";

/**
 * AdviceRow
 *
 * Layout component arranging a featured article, FAQ rail, and two
 * sponsored cards. Accepts a `reverse` prop to mirror the column order when
 * used on alternating rows.
 */
export default function AdviceRow({
  featuredArticle,
  faqArticles,
  sponsoredCards,
  faqTitle,
  onSelect,
  reverse = false,
}: {
  featuredArticle: FuneralAdviceArticle;
  faqArticles: FuneralAdviceArticle[];
  sponsoredCards: SponsoredCard[];
  faqTitle: string;
  onSelect: (article: FuneralAdviceArticle) => void;
  reverse?: boolean;
}) {
  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-stretch">
      {reverse ? (
        <>
          <div className="h-full">
            <SponsoredCardView card={sponsoredCards[0]} />
          </div>
          <div className="h-full">
            <SponsoredCardView card={sponsoredCards[1]} />
          </div>
          <div className="h-full">
            <FaqRail
              title={faqTitle}
              articles={faqArticles}
              onSelect={onSelect}
            />
          </div>
          <div className="h-full">
            <ArticlePreviewCard article={featuredArticle} onSelect={onSelect} />
          </div>
        </>
      ) : (
        <>
          <div className="h-full">
            <ArticlePreviewCard article={featuredArticle} onSelect={onSelect} />
          </div>
          <div className="h-full">
            <FaqRail
              title={faqTitle}
              articles={faqArticles}
              onSelect={onSelect}
            />
          </div>
          <div className="h-full">
            <SponsoredCardView card={sponsoredCards[0]} />
          </div>
          <div className="h-full">
            <SponsoredCardView card={sponsoredCards[1]} />
          </div>
        </>
      )}
    </div>
  );
}
