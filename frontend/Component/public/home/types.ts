export type FuneralAdviceArticle = {
  id: string;
  label: string;
  title: string;
  summary: string;
  image: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export interface SponsoredCard {
  label: string;
  title: string;
  description: string;
  image: string;
  link?: string;
};
