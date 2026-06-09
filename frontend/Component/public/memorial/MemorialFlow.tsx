"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Stepper from "./components/Stepper";
import SectionCard from "./components/SectionCard";
import Label from "./components/Label";
import TextInput from "./components/TextInput";
import TextArea from "./components/TextArea";
import FileDropZone from "./components/FileDropZone";
import SuccessScreen from "./components/SuccessScreen";
import { useAppContext } from "../../../context/AppContext";
import { useAxios } from "../../../context/AxiosProvider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

type StepId = 1 | 2 | 3 | 4;

type AdvertisementDraft = {
  id: string;
  image: string[];
  postLink: string;
};

type FuneralHomeDetails = {
  name: string;
  websiteLink: string;
  mail: string;
  phone: string;
  location: string;
  mapLink: string;
};

type FuneralNoticePart = {
  name: string;
  location: string;
  mapLink: string;
};

type FuneralNotice = {
  service: FuneralNoticePart;
  reception: FuneralNoticePart;
};

type SubmissionFlow = {
  personalDetails: {
    fullName: string;
    birthdate: string;
    dateOfDeath: string;
    location: string;
    obituary: string;
    familyDetails: string;
  };
  obituaryContent: {
    lifeStory: string;
    livesRememberedForever: string;
    favoriteQuote: string;
    careerSummary: string;
  };
  mediaUpload: {
    funeralHomeLogo: string[];
    celebrationPhotos: string[];
  };
  others: {
    relationshipToDeceased: string;
    funeralHomeDetails: FuneralHomeDetails;
    advertisements: AdvertisementDraft[];
  };
  familyTreeDiagram: string[];
  funeralNotice: FuneralNotice;
};

type DraftState = {
  currentStep: StepId;
  flow: SubmissionFlow;
};

const DRAFT_STORAGE_KEY = "memorial-flow-draft";

const createAdvertisement = (id: string): AdvertisementDraft => ({
  id,
  image: [],
  postLink: "",
});

const createFuneralHomeDetails = (): FuneralHomeDetails => ({
  name: "",
  websiteLink: "",
  mail: "",
  phone: "",
  location: "",
  mapLink: "",
});

const createFuneralNotice = (): FuneralNotice => ({
  service: { name: "", location: "", mapLink: "" },
  reception: { name: "", location: "", mapLink: "" },
});

const initialFlow: SubmissionFlow = {
  personalDetails: {
    fullName: "",
    birthdate: "",
    dateOfDeath: "",
    location: "",
    familyDetails: "",
    obituary: "",
  },
  obituaryContent: {
    lifeStory: "",
    livesRememberedForever: "",
    favoriteQuote: "",
    careerSummary: "",
  },
  mediaUpload: {
    funeralHomeLogo: [],
    celebrationPhotos: [],
  },
  others: {
    relationshipToDeceased: "",
    funeralHomeDetails: createFuneralHomeDetails(),
    advertisements: [createAdvertisement("ad-1")],
  },
  familyTreeDiagram: [],
  funeralNotice: createFuneralNotice(),
};

const isStepId = (value: unknown): value is StepId =>
  value === 1 || value === 2 || value === 3 || value === 4;

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const normalizeAdvertisement = (
  value: Partial<AdvertisementDraft> | undefined,
  fallbackId: string,
): AdvertisementDraft => ({
  id: typeof value?.id === "string" ? value.id : fallbackId,
  image: normalizeStringArray(value?.image),
  postLink: typeof value?.postLink === "string" ? value.postLink : "",
});

const normalizeFlow = (value: unknown): SubmissionFlow => {
  const raw = (value ?? {}) as Partial<SubmissionFlow> & {
    others?: Partial<SubmissionFlow["others"]> & {
      profilePhoto?: unknown;
      postLink?: unknown;
      funeralHomeDetails?: Partial<FuneralHomeDetails>;
      advertisements?: Array<Partial<AdvertisementDraft>>;
    };
  };

  const rawOthers = (raw.others ?? {}) as {
    relationshipToDeceased?: unknown;
    profilePhoto?: unknown;
    postLink?: unknown;
    funeralHomeDetails?: Partial<FuneralHomeDetails>;
    advertisements?: Array<Partial<AdvertisementDraft>>;
  };

  const advertisements = Array.isArray(rawOthers.advertisements)
    ? rawOthers.advertisements.map((ad, index) =>
        normalizeAdvertisement(ad, `ad-${index + 1}`),
      )
    : [];

  const legacyAdvertisement =
    advertisements.length > 0
      ? advertisements
      : rawOthers.postLink || rawOthers.profilePhoto
        ? [
            normalizeAdvertisement(
              {
                image: normalizeStringArray(rawOthers.profilePhoto),
                postLink:
                  typeof rawOthers.postLink === "string"
                    ? rawOthers.postLink
                    : "",
              },
              "ad-1",
            ),
          ]
        : [createAdvertisement("ad-1")];

  return {
    personalDetails: {
      ...initialFlow.personalDetails,
      ...(raw.personalDetails ?? {}),
      fullName:
        typeof raw.personalDetails?.fullName === "string"
          ? raw.personalDetails.fullName
          : "",
      birthdate:
        typeof raw.personalDetails?.birthdate === "string"
          ? raw.personalDetails.birthdate
          : "",
      dateOfDeath:
        typeof raw.personalDetails?.dateOfDeath === "string"
          ? raw.personalDetails.dateOfDeath
          : "",
      location:
        typeof raw.personalDetails?.location === "string"
          ? raw.personalDetails.location
          : "",
      familyDetails:
        typeof raw.personalDetails?.familyDetails === "string"
          ? raw.personalDetails.familyDetails
          : "",
      obituary:
        typeof raw.personalDetails?.obituary === "string"
          ? raw.personalDetails.obituary
          : "",
    },
    obituaryContent: {
      ...initialFlow.obituaryContent,
      ...(raw.obituaryContent ?? {}),
      lifeStory:
        typeof raw.obituaryContent?.lifeStory === "string"
          ? raw.obituaryContent.lifeStory
          : "",
      livesRememberedForever:
        typeof raw.obituaryContent?.livesRememberedForever === "string"
          ? raw.obituaryContent.livesRememberedForever
          : "",
      favoriteQuote:
        typeof raw.obituaryContent?.favoriteQuote === "string"
          ? raw.obituaryContent.favoriteQuote
          : "",
      careerSummary:
        typeof raw.obituaryContent?.careerSummary === "string"
          ? raw.obituaryContent.careerSummary
          : "",
    },
    mediaUpload: {
      funeralHomeLogo: normalizeStringArray(raw.mediaUpload?.funeralHomeLogo),
      celebrationPhotos: normalizeStringArray(
        raw.mediaUpload?.celebrationPhotos,
      ),
    },
    others: {
      relationshipToDeceased:
        typeof rawOthers.relationshipToDeceased === "string"
          ? rawOthers.relationshipToDeceased
          : "",
      funeralHomeDetails: {
        ...createFuneralHomeDetails(),
        ...(rawOthers.funeralHomeDetails ?? {}),
        name:
          typeof rawOthers.funeralHomeDetails?.name === "string"
            ? rawOthers.funeralHomeDetails.name
            : "",
        websiteLink:
          typeof rawOthers.funeralHomeDetails?.websiteLink === "string"
            ? rawOthers.funeralHomeDetails.websiteLink
            : "",
        mail:
          typeof rawOthers.funeralHomeDetails?.mail === "string"
            ? rawOthers.funeralHomeDetails.mail
            : "",
        phone:
          typeof rawOthers.funeralHomeDetails?.phone === "string"
            ? rawOthers.funeralHomeDetails.phone
            : "",
        location:
          typeof rawOthers.funeralHomeDetails?.location === "string"
            ? rawOthers.funeralHomeDetails.location
            : "",
        mapLink:
          typeof rawOthers.funeralHomeDetails?.mapLink === "string"
            ? rawOthers.funeralHomeDetails.mapLink
            : "",
      },
      advertisements: legacyAdvertisement,
    },
    familyTreeDiagram: normalizeStringArray(raw.familyTreeDiagram),
    funeralNotice: {
      service: {
        name:
          typeof (raw as any).funeralNotice?.service?.name === "string"
            ? (raw as any).funeralNotice.service.name
            : "",
        location:
          typeof (raw as any).funeralNotice?.service?.location === "string"
            ? (raw as any).funeralNotice.service.location
            : "",
        mapLink:
          typeof (raw as any).funeralNotice?.service?.mapLink === "string"
            ? (raw as any).funeralNotice.service.mapLink
            : "",
      },
      reception: {
        name:
          typeof (raw as any).funeralNotice?.reception?.name === "string"
            ? (raw as any).funeralNotice.reception.name
            : "",
        location:
          typeof (raw as any).funeralNotice?.reception?.location === "string"
            ? (raw as any).funeralNotice.reception.location
            : "",
        mapLink:
          typeof (raw as any).funeralNotice?.reception?.mapLink === "string"
            ? (raw as any).funeralNotice.reception.mapLink
            : "",
      },
    },
  };
};

const readDraftState = (): DraftState => {
  if (typeof window === "undefined") {
    return { currentStep: 1, flow: initialFlow };
  }

  const storedValue = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  let persistentFh = null;
  try {
    const pfh = window.localStorage.getItem("persistent-fh-details");
    if (pfh) persistentFh = JSON.parse(pfh);
  } catch {}

  const getFlowWithFh = (baseFlow: SubmissionFlow) => {
    if (persistentFh) {
      baseFlow.others.funeralHomeDetails = {
        ...baseFlow.others.funeralHomeDetails,
        ...persistentFh,
      };
    }
    return baseFlow;
  };

  if (!storedValue) {
    return { currentStep: 1, flow: getFlowWithFh({ ...initialFlow }) };
  }

  try {
    const parsed = JSON.parse(storedValue) as
      | Partial<DraftState>
      | SubmissionFlow;

    if (typeof parsed === "object" && parsed !== null && "flow" in parsed) {
      return {
        currentStep: isStepId(parsed.currentStep) ? parsed.currentStep : 1,
        flow: normalizeFlow(parsed.flow),
      };
    }

    return { currentStep: 1, flow: normalizeFlow(parsed) };
  } catch {
    return { currentStep: 1, flow: getFlowWithFh({ ...initialFlow }) };
  }
};

export default function MemorialFlow() {
  const { user, isAuthenticated } = useAppContext();
  const api = useAxios();
  const initialDraft = readDraftState();
  const [currentStep, setCurrentStep] = useState<StepId>(
    initialDraft.currentStep,
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flow, setFlow] = useState<SubmissionFlow>(initialDraft.flow);

  useEffect(() => {
    if (user?.funeralHome) {
      setFlow((prev) => {
        // Only prefill if the draft is largely empty for funeral home
        if (!prev.others.funeralHomeDetails.name) {
          return {
            ...prev,
            others: {
              ...prev.others,
              funeralHomeDetails: {
                name: user.funeralHome.name || "",
                websiteLink: user.funeralHome.website || "",
                mail: user.funeralHome.email || "",
                phone: user.funeralHome.phone || "",
                location: user.funeralHome.address || "",
                mapLink: user.funeralHome.MapLink || "",
              },
            },
          };
        }
        return prev;
      });
    }
  }, [user]);

  const updateAdvertisement = (
    advertisementId: string,
    updater: (current: AdvertisementDraft) => AdvertisementDraft,
  ) => {
    setFlow((current) => ({
      ...current,
      others: {
        ...current.others,
        advertisements: current.others.advertisements.map((advertisement) =>
          advertisement.id === advertisementId
            ? updater(advertisement)
            : advertisement,
        ),
      },
    }));
  };

  const addAdvertisement = () => {
    setFlow((current) => {
      if (current.others.advertisements.length >= 3) {
        toast.error("Maximum of 3 advertisements allowed.");
        return current;
      }
      return {
        ...current,
        others: {
          ...current.others,
          advertisements: [
            ...current.others.advertisements,
            createAdvertisement(
              `ad-${Date.now()}-${current.others.advertisements.length}`,
            ),
          ],
        },
      };
    });
  };

  const removeAdvertisement = (advertisementId: string) => {
    setFlow((current) => ({
      ...current,
      others: {
        ...current.others,
        advertisements: current.others.advertisements.filter(
          (advertisement) => advertisement.id !== advertisementId,
        ),
      },
    }));
  };

  const updateFuneralHomeDetails = <K extends keyof FuneralHomeDetails>(
    key: K,
    value: FuneralHomeDetails[K],
  ) => {
    setFlow((current) => ({
      ...current,
      others: {
        ...current.others,
        funeralHomeDetails: {
          ...current.others.funeralHomeDetails,
          [key]: value,
        },
      },
    }));
  };

  const updateFuneralNotice = (
    part: "service" | "reception",
    updater: (current: FuneralNoticePart) => FuneralNoticePart,
  ) => {
    setFlow((current) => ({
      ...current,
      funeralNotice: {
        ...current.funeralNotice,
        [part]: updater(current.funeralNotice[part]),
      } as FuneralNotice,
    }));
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ currentStep, flow }),
      );
      if (flow.others.funeralHomeDetails.name || flow.others.funeralHomeDetails.phone) {
        window.localStorage.setItem(
          "persistent-fh-details",
          JSON.stringify(flow.others.funeralHomeDetails)
        );
      }
    } catch {
      // Draft storage is best-effort only.
    }
  }, [currentStep, flow]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 4) {
      setCurrentStep((step) => (step === 4 ? 4 : ((step + 1) as StepId)));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", flow.personalDetails.fullName || "Unknown Name");
      formData.append("birthdate", flow.personalDetails.birthdate || new Date().toISOString());
      formData.append("deathDate", flow.personalDetails.dateOfDeath || new Date().toISOString());
      formData.append("location", flow.personalDetails.location || "Unknown Location");
      formData.append("memorialDetails", flow.personalDetails.obituary || "N/A");
      formData.append("familyDetails", flow.personalDetails.familyDetails || "N/A");
      formData.append("lifeStory", flow.obituaryContent.lifeStory || "N/A");
      formData.append("rememberForEverQuote", flow.obituaryContent.livesRememberedForever || "N/A");
      formData.append("favouriteQuote", flow.obituaryContent.favoriteQuote || "N/A");
      formData.append("careerSummery", flow.obituaryContent.careerSummary || "N/A");
      formData.append("relationToDeceased", flow.others.relationshipToDeceased || "N/A");
      
      const mappedFuneralHomeDetails = {
        name: flow.others.funeralHomeDetails.name || "N/A",
        website: flow.others.funeralHomeDetails.websiteLink || "",
        phone: flow.others.funeralHomeDetails.phone || "N/A",
        email: flow.others.funeralHomeDetails.mail || "noemail@example.com",
        address: flow.others.funeralHomeDetails.location || "N/A",
        mapLink: flow.others.funeralHomeDetails.mapLink || "N/A",
      };

      const mappedFuneralNotice = {
        serviceDate: new Date().toISOString(),
        serviceLocation: flow.funeralNotice.service.location || "N/A",
        serviceName: flow.funeralNotice.service.name || "N/A",
        serviceMapLink: flow.funeralNotice.service.mapLink || "N/A",
        ReceptionDate: new Date().toISOString(),
        ReceptionLocation: flow.funeralNotice.reception.location || "N/A",
        ReceptionName: flow.funeralNotice.reception.name || "N/A",
        ReceptionMapLink: flow.funeralNotice.reception.mapLink || "N/A",
      };

      formData.append("funeralHomeDetails", JSON.stringify(mappedFuneralHomeDetails));
      formData.append("funeralNotice", JSON.stringify(mappedFuneralNotice));
      
      // Ads
      const adsData = flow.others.advertisements.map(ad => ({ link: ad.postLink || "#" }));
      formData.append("funeralHomeAdvertisement", JSON.stringify(adsData));
      
      flow.others.advertisements.forEach((ad, i) => {
        if (ad.image[0] instanceof File) {
          formData.append(`adImage_${i}`, ad.image[0]);
        }
      });

      // Photos
      flow.mediaUpload.celebrationPhotos.forEach((file) => {
        if (file instanceof File) {
           formData.append("deadPersonPhoto", file);
        }
      });

      // Funeral Home Logo
      if (flow.mediaUpload.funeralHomeLogo[0] instanceof File) {
         formData.append("funeralHomeLogo", flow.mediaUpload.funeralHomeLogo[0]);
      } else if (user?.funeralHome?.logo) {
         formData.append("existingFuneralHomeLogo", user.funeralHome.logo);
      } else {
         formData.append("existingFuneralHomeLogo", "https://res.cloudinary.com/dhyq4r3nm/image/upload/v1741544464/obituary/memorials/logos/n0yvym7tffcuzry9x46w.png");
      }

      // Family Tree Diagram
      if (flow.familyTreeDiagram[0] instanceof File) {
         formData.append("familyTreeDiagram", flow.familyTreeDiagram[0]);
      } else {
         formData.append("existingFamilyTreeDiagram", "https://res.cloudinary.com/dhyq4r3nm/image/upload/v1741544464/obituary/memorials/logos/n0yvym7tffcuzry9x46w.png");
      }

      await api.post("/memorials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Memorial submitted successfully!");
      setIsSuccess(true);
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit memorial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((step) => (step === 1 ? 1 : ((step - 1) as StepId)));
  };

  const canSubmit = true;

  if (isSuccess) {
    return <SuccessScreen payload={flow} />;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f9f6f1] px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#e4d9c7] bg-white shadow-2xl">
          <div className="relative overflow-hidden bg-[#1e3a5f] px-8 py-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Sign In Required
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-blue-100">
                You must be logged in to create and submit a memorial. This
                ensures your progress is saved securely.
              </p>
            </div>
          </div>
          <div className="bg-white px-8 py-10 text-center">
            <p className="mb-8 text-base text-slate-600">
              Join us to create a beautiful, lasting tribute for your loved one.
              It only takes a minute to get started.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#274877] px-8 py-4 text-base font-medium text-white shadow-sm transition-all hover:bg-[#1e3a5f] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#274877] focus:ring-offset-2"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#274877] px-8 py-4 text-base font-medium text-[#274877] transition-all hover:bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#274877] focus:ring-offset-2"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#274877] sm:text-4xl">
            Submit an Memorial
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Create a lasting memorial for your loved one
          </p>
        </header>

        <Stepper currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          {currentStep === 1 ? (
            <SectionCard title="Deceased Person Details">
              <div className="space-y-5">
                <div>
                  <Label>Full Name *</Label>
                  <TextInput
                    value={flow.personalDetails.fullName}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        personalDetails: {
                          ...current.personalDetails,
                          fullName: value,
                        },
                      }))
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>Date of Birth</Label>
                    <TextInput
                      type="date"
                      value={flow.personalDetails.birthdate}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            birthdate: value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Date of Death *</Label>
                    <TextInput
                      type="date"
                      value={flow.personalDetails.dateOfDeath}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            dateOfDeath: value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <TextInput
                      value={flow.personalDetails.location}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            location: value,
                          },
                        }))
                      }
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label>
                      {/ireland/i.test(flow.personalDetails.location)
                        ? "Family Details"
                        : "Memorial Details"}
                    </Label>
                  </div>

                  <div>
                    <TextArea
                      value={
                        /ireland/i.test(flow.personalDetails.location)
                          ? flow.personalDetails.familyDetails
                          : flow.personalDetails.obituary
                      }
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            ...(/ireland/i.test(
                              current.personalDetails.location,
                            )
                              ? { familyDetails: value }
                              : { obituary: value }),
                          },
                        }))
                      }
                      placeholder={
                        /ireland/i.test(flow.personalDetails.location)
                          ? "Enter family details"
                          : "Write a short Memorial summary here"
                      }
                      minRows={4}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 2 ? (
            <SectionCard title="Memorial Content">
              <div className="space-y-5">
                <div>
                  <Label>Life Story *</Label>
                  <TextArea
                    value={flow.obituaryContent.lifeStory}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        obituaryContent: {
                          ...current.obituaryContent,
                          lifeStory: value,
                        },
                      }))
                    }
                    placeholder="Tell the story of their life, their accomplishments, what made them special..."
                    minRows={5}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Minimum 100 characters
                  </p>
                </div>

                <div>
                  <Label>Quote for remembered for ever</Label>
                  <TextArea
                    value={flow.obituaryContent.livesRememberedForever}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        obituaryContent: {
                          ...current.obituaryContent,
                          livesRememberedForever: value,
                        },
                      }))
                    }
                    placeholder='"Keep loving each other just like I loved you ..."'
                    minRows={3}
                  />
                </div>

                <div>
                  <Label>Favorite Quote (Optional)</Label>
                  <TextInput
                    value={flow.obituaryContent.favoriteQuote}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        obituaryContent: {
                          ...current.obituaryContent,
                          favoriteQuote: value,
                        },
                      }))
                    }
                    placeholder="A quote that represents their life philosophy"
                  />
                </div>

                <div>
                  <Label>Career Summary</Label>
                  <TextArea
                    value={flow.obituaryContent.careerSummary}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        obituaryContent: {
                          ...current.obituaryContent,
                          careerSummary: value,
                        },
                      }))
                    }
                    placeholder="Write a brief career summary"
                    minRows={3}
                  />
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 3 ? (
            <SectionCard title="Photo Gallery">
              <div className="space-y-6">
                <FileDropZone
                  title="Funeral Home Logo"
                  subtitle="PNG, JPG up to 10MB"
                  files={flow.mediaUpload.funeralHomeLogo}
                  maxFiles={1}
                  multiple={false}
                  defaultImageUrl={user?.funeralHome?.logoImageUrl}
                  onFiles={(files) =>
                    setFlow((current) => ({
                      ...current,
                      mediaUpload: {
                        ...current.mediaUpload,
                        funeralHomeLogo: files,
                      },
                    }))
                  }
                />

                <FileDropZone
                  title="Deceased Person Photo"
                  subtitle="PNG, JPG up to 10MB"
                  files={flow.mediaUpload.celebrationPhotos}
                  maxFiles={20}
                  onFiles={(files) =>
                    setFlow((current) => ({
                      ...current,
                      mediaUpload: {
                        ...current.mediaUpload,
                        celebrationPhotos: files,
                      },
                    }))
                  }
                />
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 4 ? (
            <SectionCard title="Your Information, Ads, and Family Tree">
              <div className="space-y-6">
                <div>
                  <Label>Relationship to Deceased *</Label>
                  <TextInput
                    value={flow.others.relationshipToDeceased}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        others: {
                          ...current.others,
                          relationshipToDeceased: value,
                        },
                      }))
                    }
                    placeholder="Enter relationship"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      Funeral Home Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      These details are stored separately from the family tree.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Funeral Home Name</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.name}
                        onChange={(value) =>
                          updateFuneralHomeDetails("name", value)
                        }
                        placeholder="Enter funeral home name"
                      />
                    </div>
                    <div>
                      <Label>Website Link</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.websiteLink}
                        onChange={(value) =>
                          updateFuneralHomeDetails("websiteLink", value)
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.mail}
                        onChange={(value) =>
                          updateFuneralHomeDetails("mail", value)
                        }
                        placeholder="hello@example.com"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.phone}
                        onChange={(value) =>
                          updateFuneralHomeDetails("phone", value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.location}
                        onChange={(value) =>
                          updateFuneralHomeDetails("location", value)
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label>Map Link</Label>
                      <TextInput
                        value={flow.others.funeralHomeDetails.mapLink}
                        onChange={(value) =>
                          updateFuneralHomeDetails("mapLink", value)
                        }
                        placeholder="Paste Google Maps link"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      Funeral Notice
                    </h3>
                    <p className="text-sm text-slate-500">
                      Add the service and reception details with map links.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 md:gap-0">
                    <div className="space-y-4 md:pr-6">
                      <div>
                        <Label>Service Name</Label>
                        <select
                          value={flow.funeralNotice.service.name}
                          onChange={(event) =>
                            updateFuneralNotice("service", (current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2"
                        >
                          <option value="">Select service name</option>
                          <option value="Mass">Mass</option>
                          <option value="Service">Service</option>
                        </select>
                      </div>

                      <div>
                        <Label>Service Location</Label>
                        <TextInput
                          value={flow.funeralNotice.service.location}
                          onChange={(value) =>
                            updateFuneralNotice("service", (current) => ({
                              ...current,
                              location: value,
                            }))
                          }
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <Label>Service Map Link</Label>
                        <TextInput
                          value={flow.funeralNotice.service.mapLink}
                          onChange={(value) =>
                            updateFuneralNotice("service", (current) => ({
                              ...current,
                              mapLink: value,
                            }))
                          }
                          placeholder="Paste Google Maps link"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 md:border-l md:border-slate-200 md:pl-6">
                      <div>
                        <Label>Reception Name</Label>
                        <select
                          value={flow.funeralNotice.reception.name}
                          onChange={(event) =>
                            updateFuneralNotice("reception", (current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2"
                        >
                          <option value="">Select reception name</option>
                          <option value="Reception">Reception</option>
                          <option value="Cremation">Cremation</option>
                          <option value="Burial">Burial</option>
                        </select>
                      </div>

                      <div>
                        <Label>Reception Location</Label>
                        <TextInput
                          value={flow.funeralNotice.reception.location}
                          onChange={(value) =>
                            updateFuneralNotice("reception", (current) => ({
                              ...current,
                              location: value,
                            }))
                          }
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <Label>Reception Map Link</Label>
                        <TextInput
                          value={flow.funeralNotice.reception.mapLink}
                          onChange={(value) =>
                            updateFuneralNotice("reception", (current) => ({
                              ...current,
                              mapLink: value,
                            }))
                          }
                          placeholder="Paste Google Maps link"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        Advertisements
                      </h3>
                      <p className="text-sm text-slate-500">
                        Add one or more ad cards, each with a single image.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addAdvertisement}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#274877] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Ad
                    </button>
                  </div>

                  <div className="space-y-4">
                    {flow.others.advertisements.length > 0 ? (
                      flow.others.advertisements.map((advertisement, index) => (
                        <div
                          key={advertisement.id}
                          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                Advertisement {index + 1}
                              </p>
                              <p className="text-xs text-slate-500">
                                One image per advertisement card.
                              </p>
                            </div>
                            {flow.others.advertisements.length > 1 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  removeAdvertisement(advertisement.id)
                                }
                                className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:text-rose-700"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>

                          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                            <FileDropZone
                              title="Ad Image"
                              subtitle="PNG, JPG up to 10MB"
                              files={advertisement.image}
                              maxFiles={1}
                              multiple={false}
                              onFiles={(files) =>
                                updateAdvertisement(
                                  advertisement.id,
                                  (current) => ({
                                    ...current,
                                    image: files,
                                  }),
                                )
                              }
                            />

                            <div>
                              <Label>Advertisement Link</Label>
                              <TextInput
                                value={advertisement.postLink}
                                onChange={(value) =>
                                  updateAdvertisement(
                                    advertisement.id,
                                    (current) => ({
                                      ...current,
                                      postLink: value,
                                    }),
                                  )
                                }
                                placeholder="Paste advertisement link here"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                        No advertisements yet. Add one to begin.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        Family Tree Diagram
                      </h3>
                      <p className="text-sm text-slate-500">
                        Upload an image of your family tree.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <FileDropZone
                      title="Family Tree Image"
                      subtitle="PNG, JPG up to 10MB"
                      files={flow.familyTreeDiagram as any}
                      maxFiles={1}
                      multiple={false}
                      onFiles={(files) =>
                        setFlow((current) => ({
                          ...current,
                          familyTreeDiagram: files as any,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}



          {currentStep <= 4 ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-transparent px-1">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#274877] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60] disabled:opacity-50"
              >
                {currentStep === 4 ? (isSubmitting ? "Submitting..." : "Submit for Review") : "Continue"}
                {currentStep < 4 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
