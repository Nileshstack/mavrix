"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";
import { Copy, LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { usePreloaderComplete } from "@/src/components/layout/Preloader";
import { useReducedMotion } from "@/src/components/motion/useReducedMotion";
import { siteContent } from "@/src/content/site";
import { inquirySchema, type InquiryPayload } from "@/src/lib/validation";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  projectDetails: string;
  website: string;
};

type FormField = keyof FormValues;
type FieldErrors = Partial<Record<FormField, string>>;

function isFormField(field: unknown): field is FormField {
  return (
    typeof field === "string" &&
    Object.prototype.hasOwnProperty.call(EMPTY_FORM, field)
  );
}

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  serviceInterest: "",
  projectDetails: "",
  website: "",
};

const EASE = [0.16, 1, 0.3, 1] as const;
const RATE_LIMIT_MS = 10_000;

export function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lastSubmitAt = useRef(0);
  const toastTimeout = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reducedMotion = useReducedMotion();
  const preloaderComplete = usePreloaderComplete();
  const { fields } = siteContent.contactSection.form;
  const formCopy = siteContent.contactSection.form;

  useEffect(
    () => () => {
      if (toastTimeout.current !== null) {
        window.clearTimeout(toastTimeout.current);
      }
    },
    [],
  );

  function showToast(message: string) {
    if (toastTimeout.current !== null) {
      window.clearTimeout(toastTimeout.current);
    }
    setToast(message);
    toastTimeout.current = window.setTimeout(() => setToast(null), 2600);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteContent.contact.email);
      showToast(formCopy.copiedToast);
    } catch {
      showToast(formCopy.copyFailedToast);
    }
  }

  function updateField(field: FormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleProjectDetails(event: ChangeEvent<HTMLTextAreaElement>) {
    updateField("projectDetails", event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  }

  function getValidationMessage(field: FormField) {
    const messages = formCopy.validation;
    switch (field) {
      case "name":
        return messages.name;
      case "email":
        return messages.email;
      case "phone":
        return messages.phone;
      case "company":
        return messages.company;
      case "serviceInterest":
        return messages.serviceInterest;
      case "projectDetails":
        return messages.projectDetails;
      case "website":
        return undefined;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const now = Date.now();
    if (now - lastSubmitAt.current < RATE_LIMIT_MS) {
      showToast(formCopy.rateLimitMessage);
      return;
    }

    if (values.website.trim()) {
      setIsSubmitted(true);
      return;
    }

    const parsed = inquirySchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (isFormField(field) && !nextErrors[field]) {
          nextErrors[field] = getValidationMessage(field);
        }
      }
      setErrors(nextErrors);
      return;
    }

    lastSubmitAt.current = now;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies InquiryPayload),
      });

      if (!response.ok) {
        setErrors({ projectDetails: formCopy.genericError });
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrors({ projectDetails: formCopy.genericError });
    } finally {
      setIsSubmitting(false);
    }
  }

  function sendAnother() {
    setValues(EMPTY_FORM);
    setErrors({});
    setIsSubmitted(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  const contactRows = [
    {
      label: siteContent.contactSection.contactLabels[0],
      value: siteContent.contact.email,
      icon: Mail,
      href: `mailto:${siteContent.contact.email}`,
    },
    {
      label: siteContent.contactSection.contactLabels[1],
      value: siteContent.contact.phone,
      icon: Phone,
      href: `tel:${siteContent.contact.phone.replace(/\s/g, "")}`,
    },
    {
      label: siteContent.contactSection.contactLabels[2],
      value: siteContent.contact.address,
      icon: MapPin,
      href: `https://maps.google.com/?q=${encodeURIComponent(siteContent.contact.address)}`,
    },
  ];

  function renderInput(
    field: Exclude<FormField, "projectDetails" | "website" | "serviceInterest">,
    label: string,
    type = "text",
  ) {
    const id = `inquiry-${field}`;
    return (
      <div className="contact-field">
        <input
          id={id}
          name={field}
          type={type}
          value={values[field]}
          onChange={(event) => updateField(field, event.target.value)}
          placeholder=" "
          autoComplete={
            field === "name"
              ? "name"
              : field === "email"
                ? "email"
                : field === "phone"
                  ? "tel"
                  : "organization"
          }
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `${id}-error` : undefined}
          className="contact-control peer"
        />
        <label htmlFor={id} className="contact-floating-label">
          {label}
        </label>
        <AnimatePresence initial={false}>
          {errors[field] && (
            <motion.p
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.24, ease: EASE }}
              className="overflow-hidden pt-2 text-xs text-[#ffb8bd]"
            >
              {errors[field]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <section
      id="contact"
      className="scroll-target relative overflow-hidden bg-navy px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16"
    >
      <div aria-hidden="true" className="contact-background pointer-events-none absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
        whileInView={preloaderComplete ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0.2 : 0.65, ease: EASE }}
        className="relative z-[1] mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
      >
        <div className="flex flex-col">
          <p className="flex items-center gap-3 font-technical text-xs uppercase tracking-[0.16em] text-white/60">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {siteContent.contactSection.eyebrow}
          </p>
          <h2 className="mt-6 text-display-md font-semibold leading-[0.98] tracking-[-0.06em] text-white">
            {siteContent.contactSection.headline[0]}
            <br />
            <span className="font-editorial font-normal text-accent">
              {siteContent.contactSection.headline[1]}
            </span>
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            {siteContent.contactSection.sub}
          </p>

          <div className="my-9 h-px w-full max-w-lg bg-white/15" />
          <div className="flex flex-col gap-5">
            {contactRows.map(({ label, value, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                onClick={
                  label === siteContent.contactSection.contactLabels[0]
                    ? (event: MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        void copyEmail();
                      }
                    : undefined
                }
                target={label === siteContent.contactSection.contactLabels[2] ? "_blank" : undefined}
                rel={label === siteContent.contactSection.contactLabels[2] ? "noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-technical text-[9px] uppercase tracking-[0.14em] text-white/40">
                    {label}
                  </span>
                  <span className="mt-1 flex items-center gap-2 break-words text-sm text-white/85 sm:text-base">
                    {value}
                    {label === siteContent.contactSection.contactLabels[0] && (
                      <Copy
                        aria-hidden="true"
                        className="size-3 shrink-0 text-white/35 transition-colors group-hover:text-accent"
                      />
                    )}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-form-card rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8 lg:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.18 : 0.35, ease: EASE }}
                className="flex min-h-[30rem] flex-col items-center justify-center text-center"
                role="status"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 64 64"
                  className="size-16 text-[#69dfad]"
                  fill="none"
                >
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="27"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reducedMotion ? 0 : 0.55, ease: EASE }}
                  />
                  <motion.path
                    d="m19 33 9 9 18-20"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.45,
                      delay: reducedMotion ? 0 : 0.3,
                      ease: EASE,
                    }}
                  />
                </svg>
                <p className="mt-7 max-w-sm text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                  {formCopy.success}
                </p>
                <button
                  type="button"
                  onClick={sendAnother}
                  className="mt-7 border-b border-accent pb-1 text-sm text-accent transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {formCopy.sendAnother}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: EASE }}
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  {formCopy.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {formCopy.helper}
                </p>

                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="contact-honeypot"
                  >
                    <label htmlFor="inquiry-website">{formCopy.honeypotLabel}</label>
                    <input
                      id="inquiry-website"
                      name="website"
                      value={values.website}
                      onChange={(event) => updateField("website", event.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {renderInput("name", fields.name)}
                    {renderInput("email", fields.email, "email")}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {renderInput("phone", fields.phone, "tel")}
                    {renderInput("company", fields.company)}
                  </div>

                  <div className="contact-field">
                    <select
                      id="inquiry-serviceInterest"
                      name="serviceInterest"
                      value={values.serviceInterest}
                      data-filled={Boolean(values.serviceInterest)}
                      onChange={(event) =>
                        updateField("serviceInterest", event.target.value)
                      }
                      aria-invalid={Boolean(errors.serviceInterest)}
                      aria-describedby={
                        errors.serviceInterest
                          ? "inquiry-serviceInterest-error"
                          : undefined
                      }
                      className="contact-control contact-select peer"
                    >
                      <option value="" disabled>
                        {fields.serviceInterest.label}
                      </option>
                      {fields.serviceInterest.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor="inquiry-serviceInterest"
                      className="contact-floating-label"
                    >
                      {fields.serviceInterest.label}
                    </label>
                    <AnimatePresence initial={false}>
                      {errors.serviceInterest && (
                        <motion.p
                          id="inquiry-serviceInterest-error"
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{
                            duration: reducedMotion ? 0.15 : 0.24,
                            ease: EASE,
                          }}
                          className="overflow-hidden pt-2 text-xs text-[#ffb8bd]"
                        >
                          {errors.serviceInterest}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="contact-field">
                    <textarea
                      ref={textareaRef}
                      id="inquiry-projectDetails"
                      name="projectDetails"
                      value={values.projectDetails}
                      onChange={handleProjectDetails}
                      placeholder=" "
                      rows={3}
                      aria-invalid={Boolean(errors.projectDetails)}
                      aria-describedby={
                        errors.projectDetails
                          ? "inquiry-projectDetails-error"
                          : undefined
                      }
                      className="contact-control contact-textarea peer"
                    />
                    <label
                      htmlFor="inquiry-projectDetails"
                      className="contact-floating-label"
                    >
                      {fields.projectDetails}
                    </label>
                    <AnimatePresence initial={false}>
                      {errors.projectDetails && (
                        <motion.p
                          id="inquiry-projectDetails-error"
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{
                            duration: reducedMotion ? 0.15 : 0.24,
                            ease: EASE,
                          }}
                          className="overflow-hidden pt-2 text-xs text-[#ffb8bd]"
                        >
                          {errors.projectDetails}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit flex min-h-14 w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          aria-hidden="true"
                          className="size-4 animate-spin motion-reduce:animate-none"
                        />
                        {formCopy.loading}
                      </>
                    ) : (
                      formCopy.submit
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.25, ease: EASE }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#172039] px-5 py-3 text-sm text-white shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
