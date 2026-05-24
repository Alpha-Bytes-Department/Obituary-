"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import Stepper from "./components/Stepper";
import SectionCard from "./components/SectionCard";
import Label from "./components/Label";
import TextInput from "./components/TextInput";
import TextArea from "./components/TextArea";
import FileDropZone from "./components/FileDropZone";
import FamilyTreeCanvas, {
  type FamilyMember,
} from "./components/FamilyTreeCanvas";
import SuccessScreen from "./components/SuccessScreen";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

type StepId = 1 | 2 | 3 | 4 | 5;

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
  familyTree: FamilyMember[];
  payment: {
    packageName: string;
    promoCode: string;
    termsAccepted: boolean;
  };
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

const initialFamilyTree: FamilyMember[] = [];

const initialFlow: SubmissionFlow = {
  personalDetails: {
    fullName: "",
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
  familyTree: initialFamilyTree,
  payment: {
    packageName: "Memorial Package",
    promoCode: "",
    termsAccepted: true,
  },
  funeralNotice: createFuneralNotice(),
};

const isStepId = (value: unknown): value is StepId =>
  value === 1 || value === 2 || value === 3 || value === 4 || value === 5;

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
    payment?: Partial<SubmissionFlow["payment"]>;
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
    familyTree: initialFamilyTree,
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
    payment: {
      packageName:
        typeof raw.payment?.packageName === "string"
          ? raw.payment.packageName
          : "Memorial Package",
      promoCode:
        typeof raw.payment?.promoCode === "string" ? raw.payment.promoCode : "",
      termsAccepted:
        typeof raw.payment?.termsAccepted === "boolean"
          ? raw.payment.termsAccepted
          : true,
    },
  };
};

const readDraftState = (): DraftState => {
  if (typeof window === "undefined") {
    return { currentStep: 1, flow: initialFlow };
  }

  const storedValue = window.localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!storedValue) {
    return { currentStep: 1, flow: initialFlow };
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
    return { currentStep: 1, flow: initialFlow };
  }
};

export default function MemorialFlow() {
  const initialDraft = readDraftState();
  const [currentStep, setCurrentStep] = useState<StepId>(
    initialDraft.currentStep,
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [flow, setFlow] = useState<SubmissionFlow>(initialDraft.flow);
  const [isFamilyTreeModalOpen, setIsFamilyTreeModalOpen] = useState(false);

  const updateFamilyTree = (nextFamilyTree: FamilyMember[]) => {
    setFlow((current) => ({
      ...current,
      familyTree: nextFamilyTree,
    }));
  };

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
    setFlow((current) => ({
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
    }));
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
    } catch {
      // Draft storage is best-effort only.
    }
  }, [currentStep, flow]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 5) {
      setCurrentStep((step) => (step === 5 ? 5 : ((step + 1) as StepId)));
      return;
    }

    console.log("Submitted memorial data:", { currentStep, flow });
    setIsSuccess(true);
  };

  const handlePrevious = () => {
    setCurrentStep((step) => (step === 1 ? 1 : ((step - 1) as StepId)));
  };

  const canSubmit = flow.payment.termsAccepted;
  const promoCode = flow.payment.promoCode.trim().toUpperCase();
  const basePrice = 99;
  const discountAmount = promoCode === "XYZ123" ? basePrice : 0;
  const totalDue = Math.max(basePrice - discountAmount, 0);

  if (isSuccess) {
    return <SuccessScreen payload={flow} />;
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

                <div className="grid gap-5">
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
                        Family Tree Builder
                      </h3>
                      <p className="text-sm text-slate-500">
                        Open the modal to manage the family tree.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFamilyTreeModalOpen(true)}
                      className="rounded-lg bg-[#274877] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
                    >
                      Open Family Tree Modal
                    </button>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                      {flow.familyTree.length} family members saved.
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 5 ? (
            <SectionCard title="Payment">
              <div className="flex flex-col gap-6 ">
                <div className="flex-1 space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Memorial Package
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                        Secure memorial checkout
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Apply a promo code before submitting. XYZ123 makes the
                        demo checkout completely free.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#274877]">
                      Draft saved automatically
                    </span>
                  </div>

                  <div className="rounded-2xl border border-[#eadfc6] bg-[#fbf8f1] p-4">
                    <div className="flex items-center justify-between gap-3 border-b border-[#eadfc6] pb-3">
                      <span className="text-sm text-slate-500">Package</span>
                      <span className="text-sm font-medium text-slate-900">
                        {flow.payment.packageName}
                      </span>
                    </div>
                    <div className="space-y-3 py-4 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Base price</span>
                        <span className="font-medium text-slate-900">
                          ${basePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Promo discount</span>
                        <span className="font-medium text-emerald-700">
                          -${discountAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#eadfc6] pt-3 text-base font-semibold text-slate-950">
                        <span>Total due</span>
                        <span>${totalDue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Promo Code</Label>
                    <TextInput
                      value={flow.payment.promoCode}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          payment: {
                            ...current.payment,
                            promoCode: value,
                          },
                        }))
                      }
                      placeholder="Enter promo code"
                    />
                    <p
                      className={`mt-2 text-xs ${
                        promoCode === "XYZ123"
                          ? "text-emerald-700"
                          : promoCode
                            ? "text-amber-700"
                            : "text-slate-400"
                      }`}
                    >
                      {promoCode === "XYZ123"
                        ? "XYZ123 applied. Your demo total is free."
                        : promoCode
                          ? "Promo code does not match the free test code."
                          : "Use XYZ123 for a 100% free demo checkout."}
                    </p>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={flow.payment.termsAccepted}
                      onChange={(event) =>
                        setFlow((current) => ({
                          ...current,
                          payment: {
                            ...current.payment,
                            termsAccepted: event.target.checked,
                          },
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-[#274877] focus:ring-[#274877]"
                    />
                    <span>
                      I agree to the Terms of Service and understand that my
                      submission will be reviewed before publication.
                    </span>
                  </label>
                </div>

                <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Checkout summary
                  </p>
                  <div className="mt-4 space-y-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Advertisement cards</span>
                      <span className="font-medium text-slate-950">
                        {flow.others.advertisements.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Family members</span>
                      <span className="font-medium text-slate-950">
                        {flow.familyTree.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Funeral home name</span>
                      <span className="max-w-44 truncate font-medium text-slate-950">
                        {flow.others.funeralHomeDetails.name || "Not added yet"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#274877] px-4 py-4 text-white">
                    <p className="text-sm text-white/80">Amount due today</p>
                    <p className="mt-1 text-3xl font-semibold">
                      ${totalDue.toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      {promoCode === "XYZ123"
                        ? "100% discount applied for testing."
                        : "Apply a promo code before submitting."}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex-1 rounded-lg bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60] disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Submit for Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep < 5 ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-transparent px-1">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#274877] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </form>
      </div>

      <Dialog
        open={isFamilyTreeModalOpen}
        onOpenChange={(open) => setIsFamilyTreeModalOpen(open)}
      >
        <DialogContent className="w-[calc(100%-1rem)] max-w-5xl p-0 sm:max-w-5xl">
          <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle>Family Tree Builder</DialogTitle>
              <DialogDescription>
                Manage the family tree here. Funeral home details are entered in
                the separate section on the form.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-6">
              <FamilyTreeCanvas
                familyTree={flow.familyTree}
                onChange={updateFamilyTree}
              />
            </div>

            <DialogFooter className="mt-6 border-t border-slate-200 bg-transparent px-0 pb-0 pt-5">
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  onClick={() => setIsFamilyTreeModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
