"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type PolicyKey = "privacy" | "terms" | "cookies";

type PolicySection = {
  title: string;
  body: string;
};

const policies: Record<
  PolicyKey,
  { title: string; description: string; sections: PolicySection[] }
> = {
  privacy: {
    title: "Privacy Policy",
    description:
      "How Orbelofy handles account, memorial, tribute, and donation-related information.",
    sections: [
      {
        title: "Information We Collect",
        body: "We collect information you provide when creating an account, submitting an obituary, adding memorial details, uploading photos, adding funeral information, leaving tributes, or contacting the site. This may include names, email addresses, phone numbers, locations, relationship details, images, funeral home information, and memorial content.",
      },
      {
        title: "Payments And Donations",
        body: "When donations are enabled, payment details are handled by the payment provider. Orbelofy receives payment status and donation records needed to show and manage the donation, but we do not store full card numbers.",
      },
      {
        title: "How We Use Information",
        body: "We use information to create and display memorial pages, manage user profiles, review submissions, provide admin tools, send account or password emails, process donations, prevent misuse, and improve the website experience.",
      },
      {
        title: "Sharing Information",
        body: "Published memorial content is visible to website visitors. We may share limited information with service providers that help operate the website, such as hosting, email delivery, image storage, analytics, and payment processing.",
      },
      {
        title: "Your Choices",
        body: "You can update account information, request changes to memorial content, or ask for content removal where appropriate. Some records may be retained when required for security, payment, audit, or legal reasons.",
      },
      {
        title: "Security And Retention",
        body: "We use reasonable safeguards to protect information and keep it only as long as needed for the website, memorial records, dispute handling, legal obligations, or legitimate operational purposes.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description:
      "The terms for using Orbelofy to browse, submit, manage, and support memorial pages.",
    sections: [
      {
        title: "Using Orbelofy",
        body: "By using Orbelofy, you agree to use the website respectfully and only for lawful memorial, obituary, tribute, profile, donation, and funeral-information purposes.",
      },
      {
        title: "Memorial Submissions",
        body: "You are responsible for the accuracy of content you submit, including names, dates, photos, family information, funeral details, links, and donation information. Submissions may be reviewed, edited, hidden, or removed by administrators.",
      },
      {
        title: "Content Permission",
        body: "By submitting text, images, logos, family tree images, or other content, you confirm that you have the right to provide it and allow Orbelofy to display it as part of the memorial page and related website features.",
      },
      {
        title: "Tributes And Conduct",
        body: "Tributes, condolences, and shared content must be respectful. Content that is abusive, misleading, private without permission, unlawful, spam, or otherwise inappropriate may be removed.",
      },
      {
        title: "Donations",
        body: "Donation receiving may be turned on or off for a memorial. Payments are processed through third-party payment services, and donation availability can change based on admin settings, payment-provider status, or legal and operational requirements.",
      },
      {
        title: "Availability And Changes",
        body: "We work to keep the website available and accurate, but features may change, pause, or become unavailable. Orbelofy is not responsible for losses caused by interruptions, user-submitted errors, third-party services, or external links.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "How Orbelofy uses cookies and similar browser storage for core website functions.",
    sections: [
      {
        title: "What Cookies Are",
        body: "Cookies and similar technologies are small pieces of data stored by your browser to help a website remember useful information between pages and visits.",
      },
      {
        title: "Essential Cookies",
        body: "Orbelofy may use essential cookies or browser storage for login sessions, security, form behavior, navigation, and protected admin or profile areas.",
      },
      {
        title: "Preferences And Performance",
        body: "We may use limited storage to remember preferences and understand how the website performs, so memorial browsing, submissions, uploads, and account features can work more reliably.",
      },
      {
        title: "Third-Party Services",
        body: "Services used for payments, image delivery, hosting, analytics, or embedded links may use their own cookies according to their own policies.",
      },
      {
        title: "Managing Cookies",
        body: "You can control cookies in your browser settings. Blocking essential cookies may prevent login, profile, admin, donation, or form-submission features from working correctly.",
      },
    ],
  },
};

const serviceLinks = [
  { label: "Find a Memorial", href: "/obituary" },
  { label: "Submit Obituary", href: "/memorial" },
  { label: "Profile", href: "/profile" },
];

const supportLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Reset Password", href: "/forgot-password" },
];

/**
 * Renders the application footer.
 *
 * @returns {JSX.Element} The footer.
 */
export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const currentPolicy = activePolicy ? policies[activePolicy] : null;

  return (
    <footer className="border-t border-[#23436c] bg-[#23436c] text-white">
      <div className="mx-auto max-w-[90vw] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" aria-label="Go to Orbelofy home">
              <Image src="/logo.png" alt="Orbelofy" width={100} height={100} />
            </Link>
            <div className="flex items-center gap-4 text-white/90">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:bg-white/10"
              >
                <FaFacebook size={35} />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-md transition hover:bg-white/10"
              >
                <FaYoutube size={40} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy("privacy")}
                  className="text-left transition hover:text-white"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy("terms")}
                  className="text-left transition hover:text-white"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy("cookies")}
                  className="text-left transition hover:text-white"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(activePolicy)} onOpenChange={(open) => !open && setActivePolicy(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-3xl overflow-hidden p-0 sm:max-w-3xl">
          {currentPolicy && (
            <div className="max-h-[90vh] overflow-y-auto bg-white px-5 py-6 text-slate-800 sm:px-8 sm:py-7">
              <DialogHeader className="items-center text-center">
                <Image src="/logo.png" alt="Orbelofy" width={96} height={96} />
                <DialogTitle className="text-2xl font-semibold text-[#23436c]">
                  {currentPolicy.title}
                </DialogTitle>
                <DialogDescription className="max-w-xl text-sm leading-6 text-slate-600">
                  {currentPolicy.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-7 space-y-5">
                {currentPolicy.sections.map((section) => (
                  <section key={section.title} className="rounded-md border border-slate-200 bg-slate-50/80 p-4">
                    <h4 className="font-semibold text-[#23436c]">{section.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{section.body}</p>
                  </section>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
}
