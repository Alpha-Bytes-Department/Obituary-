"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
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

type StepId = 1 | 2 | 3 | 4 | 5;

type SubmissionFlow = {
  personalDetails: {
    fullName: string;
    dateOfDeath: string;
    location: string;
    publishScope: string;
    publishDetails: string;
  };
  obituaryContent: {
    lifeStory: string;
    livesRememberedForever: string;
    obituaryRelativesAndFriends: string;
    favoriteQuote: string;
    hobbies: string;
    career: string;
  };
  mediaUpload: {
    funeralHomeLogo: string[];
    celebrationPhotos: string[];
  };
  others: {
    relationshipToDeceased: string;
    profilePhoto: string[];
    postLink: string;
  };
  familyTree: FamilyMember[];
  payment: {
    packageName: string;
    termsAccepted: boolean;
  };
};

const steps: Array<{ id: StepId; label: string }> = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Obituary Content" },
  { id: 3, label: "Media Upload" },
  { id: 4, label: "Others" },
  { id: 5, label: "Payment" },
];

const initialFamilyTree: FamilyMember[] = [
  { id: "ft-1", name: "Father", relation: "Grandfather", side: "left" },
  { id: "ft-2", name: "Mother", relation: "Grandmother", side: "right" },
  { id: "ft-3", name: "Son", relation: "Child", side: "left" },
  { id: "ft-4", name: "Daughter", relation: "Child", side: "right" },
];

const initialFlow: SubmissionFlow = {
  personalDetails: {
    fullName: "",
    dateOfDeath: "",
    location: "",
    publishScope: "public",
    publishDetails: "",
  },
  obituaryContent: {
    lifeStory: "",
    livesRememberedForever: "",
    obituaryRelativesAndFriends: "",
    favoriteQuote: "",
    hobbies: "",
    career: "",
  },
  mediaUpload: {
    funeralHomeLogo: [],
    celebrationPhotos: [],
  },
  others: {
    relationshipToDeceased: "",
    profilePhoto: [],
    postLink: "",
  },
  familyTree: initialFamilyTree,
  payment: {
    packageName: "Memorial Package",
    termsAccepted: true,
  },
};

export default function MemorialFlow() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flow, setFlow] = useState<SubmissionFlow>(initialFlow);

  const currentStepLabel = useMemo(
    () => steps.find((step) => step.id === currentStep)?.label ?? "",
    [currentStep],
  );

  const updateFamilyTree = (
    updater: (current: FamilyMember[]) => FamilyMember[],
  ) => {
    setFlow((current) => ({
      ...current,
      familyTree: updater(current.familyTree),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 5) {
      setCurrentStep((step) => (step === 5 ? 5 : ((step + 1) as StepId)));
      return;
    }

    console.log("Total memorial input flow:", flow);
    setIsSuccess(true);
  };

  const handlePrevious = () => {
    setCurrentStep((step) => (step === 1 ? 1 : ((step - 1) as StepId)));
  };

  const canSubmit = flow.payment.termsAccepted;

  if (isSuccess) {
    return <SuccessScreen payload={flow} />;
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#274877] sm:text-4xl">
            Submit an Obituary
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

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>Publish Scope</Label>
                    <select
                      value={flow.personalDetails.publishScope}
                      onChange={(event) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            publishScope: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#274877]"
                    >
                      <option value="public">
                        Public — Visible to everyone
                      </option>
                      <option value="private">Private — Family only</option>
                      <option value="regional">
                        Regional — Visible in selected region
                      </option>
                    </select>
                  </div>
                  <div>
                    <Label>Details</Label>
                    <TextInput
                      value={flow.personalDetails.publishDetails}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          personalDetails: {
                            ...current.personalDetails,
                            publishDetails: value,
                          },
                        }))
                      }
                      placeholder="Region, Funeral home, or visibility notes"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 2 ? (
            <SectionCard title="Obituary Content">
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
                  <Label>Lives Remembered Forever</Label>
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
                  <Label>Obituary/Relatives and friends</Label>
                  <TextArea
                    value={flow.obituaryContent.obituaryRelativesAndFriends}
                    onChange={(value) =>
                      setFlow((current) => ({
                        ...current,
                        obituaryContent: {
                          ...current.obituaryContent,
                          obituaryRelativesAndFriends: value,
                        },
                      }))
                    }
                    placeholder="Survived by husband James Thompson, children Jennifer, Michael, and David, 7 grandchildren, and 2 great-grandchildren"
                    minRows={4}
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

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label>Hobbies</Label>
                    <TextInput
                      value={flow.obituaryContent.hobbies}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          obituaryContent: {
                            ...current.obituaryContent,
                            hobbies: value,
                          },
                        }))
                      }
                      placeholder="Write here"
                    />
                  </div>
                  <div>
                    <Label>Career</Label>
                    <TextInput
                      value={flow.obituaryContent.career}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          obituaryContent: {
                            ...current.obituaryContent,
                            career: value,
                          },
                        }))
                      }
                      placeholder="Write here"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 3 ? (
            <SectionCard title="Photo Gallery">
              <div className="space-y-6">
                <p className="text-sm text-slate-500">
                  Funeral home logo (Your profile logo will be added
                  automatically. Change it here if needed).
                </p>
                <FileDropZone
                  title=""
                  subtitle="PNG, JPG up to 10MB each (maximum 20 photos)"
                  files={flow.mediaUpload.funeralHomeLogo}
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

                <p className="text-sm text-slate-500">
                  Upload photos that celebrate their life
                </p>
                <FileDropZone
                  title=""
                  subtitle="PNG, JPG up to 10MB each (maximum 20 photos)"
                  files={flow.mediaUpload.celebrationPhotos}
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
            <SectionCard title="Your Information">
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

                <div className="grid gap-5 md:grid-cols-[0.55fr_1fr]">
                  <FileDropZone
                    title=""
                    subtitle="PNG, JPG up to 10MB each (maximum 20 photos)"
                    files={flow.others.profilePhoto}
                    multiple={false}
                    onFiles={(files) =>
                      setFlow((current) => ({
                        ...current,
                        others: {
                          ...current.others,
                          profilePhoto: files,
                        },
                      }))
                    }
                  />

                  <div>
                    <Label>Post link (Funeral Home AD)</Label>
                    <TextInput
                      value={flow.others.postLink}
                      onChange={(value) =>
                        setFlow((current) => ({
                          ...current,
                          others: {
                            ...current.others,
                            postLink: value,
                          },
                        }))
                      }
                      placeholder="Paste link here"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
                  >
                    <Plus className="h-4 w-4" />
                    Add More
                  </button>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      Create Family Tree
                    </h3>
                    <button
                      type="button"
                      className="rounded-lg bg-[#274877] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
                    >
                      Add Family Tree
                    </button>
                  </div>
                  <FamilyTreeCanvas
                    familyTree={flow.familyTree}
                    onAddMember={(member) =>
                      updateFamilyTree((current) => [
                        ...current,
                        {
                          id: `ft-${Date.now()}-${current.length}`,
                          ...member,
                        },
                      ])
                    }
                    onRemoveMember={(id) =>
                      updateFamilyTree((current) =>
                        current.filter((member) => member.id !== id),
                      )
                    }
                  />
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 5 ? (
            <SectionCard title="Payment">
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#eadfc6] bg-[#fbf8f1] px-4 py-5">
                  <p className="text-sm text-slate-700">Memorial Package</p>
                  <div className="mt-5 flex items-center justify-between border-t border-[#eadfc6] pt-5">
                    <span className="text-sm text-slate-500">Price</span>
                    <span className="text-2xl font-medium text-[#274877]">
                      $00
                    </span>
                  </div>
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

                <div className="border-t border-slate-200 pt-6">
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
    </main>
  );
}
