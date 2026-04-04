import React, { memo, useMemo, useRef, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { apiUrl } from "../config/api";
import "./Dashboard.css";
import "./AiOptimizer.css";

const DEFAULT_SUBJECT = "Job Application";
const DEFAULT_TEMPLATE =
  "Hello HR Team,\n\nPlease find my optimized resume attached for your review. I would love the opportunity to discuss how my experience aligns with this role.\n\nThank you for your time and consideration.";

function extractOptimizedText(data) {
  if (data && typeof data === "object") {
    return JSON.stringify(data, null, 2);
  }

  if (typeof data === "string") {
    return data;
  }

  return "";
}

function toastTone(type) {
  return type === "success" ? "success" : "error";
}

function extractServerMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    return JSON.stringify(data);
  }

  return fallback;
}

const StepIndicator = memo(function StepIndicator({ currentStep, completedSteps }) {
  const steps = [
    { number: 1, label: "Upload Resume" },
    { number: 2, label: "Job Description" },
    { number: 3, label: "Optimize" },
  ];

  return (
    <div className="optimizer-stepper" aria-label="Optimizer progress">
      {steps.map((step, index) => {
        const isComplete = completedSteps.includes(step.number);
        const isActive = currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            <div
              className={`optimizer-stepper__item${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
            >
              <span className="optimizer-stepper__badge">
                {isComplete ? "✓" : step.number}
              </span>
              <span className="optimizer-stepper__label">{step.label}</span>
            </div>

            {index < steps.length - 1 && <span className="optimizer-stepper__connector" aria-hidden />}
          </React.Fragment>
        );
      })}
    </div>
  );
});

const StepUploadCard = memo(function StepUploadCard({
  stepTitle,
  file,
  status,
  error,
  onPick,
  onDropFile,
  inputRef,
  disabled = false,
  allowPaste = false,
  pastedValue = "",
  onPasteChange,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const isBusy = status === "uploading";
  const isReady = status === "ready" || status === "manual";
  const isManual = status === "manual";

  return (
    <div
      className={`optimizer-step-card${isReady ? " optimizer-step-card--ready" : ""}${error ? " optimizer-step-card--error" : ""}${isDragging ? " optimizer-step-card--dragging" : ""}${disabled ? " optimizer-step-card--disabled" : ""}`}
      onDragOver={(event) => {
        if (disabled) {
          return;
        }
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        if (disabled) {
          return;
        }
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
          onDropFile(droppedFile);
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="optimizer-step-card__input"
        accept=".pdf,.doc,.docx,.txt"
        disabled={disabled}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) {
            onPick(selectedFile);
          }
        }}
      />

      <div className="optimizer-step-card__header">
        <h3>{stepTitle}</h3>
        {isReady && <span className="optimizer-step-card__done">Completed</span>}
      </div>

      <div className="optimizer-step-card__icon" aria-hidden>
        <UploadIcon />
      </div>

      <div className="optimizer-step-card__body">
        {isReady ? (
          <div className="optimizer-step-card__success">
            <div className="optimizer-step-card__success-row">
              <span className="optimizer-step-card__check" aria-hidden>
                ✓
              </span>
              <span>
                {isManual
                  ? "Job description pasted successfully"
                  : `${file?.name ?? "File"} uploaded`}
              </span>
            </div>

            <button
              type="button"
              className="optimizer-step-card__replace"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Replace file
            </button>
          </div>
        ) : (
          <>
            <div className="optimizer-step-card__dropzone">
              <p>Drag & drop your file or click to upload</p>
              <button
                type="button"
                className="optimizer-step-card__button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Choose file
              </button>
              <span className="optimizer-step-card__hint">Supported: PDF, DOC, DOCX</span>
            </div>

            {allowPaste && (
              <div className="optimizer-step-card__paste">
                <span className="optimizer-step-card__paste-label">
                  or paste job description
                </span>
                <textarea
                  value={pastedValue}
                  onChange={(event) => onPasteChange?.(event.target.value)}
                  placeholder="Paste the job description here if you don’t want to upload a file."
                  disabled={disabled}
                />
              </div>
            )}
          </>
        )}

        <div className="optimizer-step-card__footer">
          {isBusy && <span className="optimizer-step-card__status">Extracting text…</span>}
          {!isBusy && !isReady && (
            <span className="optimizer-step-card__status optimizer-step-card__status--muted">
              {disabled ? "Complete the previous step to unlock this" : "Awaiting upload"}
            </span>
          )}
          {isReady && (
            <span className="optimizer-step-card__status optimizer-step-card__status--ready">
              Ready
            </span>
          )}
        </div>
      </div>

      {error && <p className="optimizer-step-card__error">{error}</p>}
    </div>
  );
});

function AiOptimizer() {
  const resumeInputRef = useRef(null);
  const jobInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [extractedResumeText, setExtractedResumeText] = useState("");
  const [extractedJobText, setExtractedJobText] = useState("");
  const [resumeStatus, setResumeStatus] = useState("idle");
  const [jobStatus, setJobStatus] = useState("idle");
  const [resumeError, setResumeError] = useState("");
  const [jobError, setJobError] = useState("");
  const [optimizeError, setOptimizeError] = useState("");
  const [optimizeState, setOptimizeState] = useState("idle");
  const [optimizedText, setOptimizedText] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [hrEmail, setHrEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toast, setToast] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");

  async function extractFileText(file, kind) {
    const setFile = kind === "resume" ? setResumeFile : setJobFile;
    const setStatus = kind === "resume" ? setResumeStatus : setJobStatus;
    const setError = kind === "resume" ? setResumeError : setJobError;
    const setText = kind === "resume" ? setExtractedResumeText : setExtractedJobText;

    setFile(file);
    setText("");
    setError("");
    setStatus("uploading");
    setOptimizeError("");

    if (kind === "job") {
      setJobDescriptionInput("");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(apiUrl("/api/parser/extract-text"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedText = typeof response.data?.text === "string" ? response.data.text : "";

      if (!extractedText.trim()) {
        throw new Error("No text was extracted from the uploaded file.");
      }

      setText(extractedText);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setFile(null);
      setText("");
      setError(
        axios.isAxiosError(error) && error.response?.status
          ? `Extraction failed (${error.response.status}).`
          : "Could not extract text from this file."
      );
    }
  }

  async function handleOptimize() {
    if (!extractedResumeText.trim() || !extractedJobText.trim()) {
      return;
    }

    setOptimizeState("loading");
    setOptimizeError("");
    setToast(null);

    try {
      const response = await axios.post(apiUrl("/api/job-applications/optimize"), {
        rawResume: extractedResumeText,
        jobDescription: extractedJobText,
      });

      const formattedText =
        typeof response.data === "object"
          ? JSON.stringify(response.data, null, 2)
          : response.data;
      const nextOptimizedText = extractOptimizedText(formattedText).trim();

      if (!nextOptimizedText) {
        throw new Error("Optimization response was empty.");
      }

      setOptimizedText(nextOptimizedText);
      setIsEditable(true);
      setOptimizeState("done");
    } catch (error) {
      setOptimizeState("idle");
      setOptimizeError(
        axios.isAxiosError(error) && error.response?.status
          ? `Optimization failed (${error.response.status}).`
          : "Could not optimize the resume right now."
      );
    }
  }

  async function handleDownloadPdf() {
    if (!optimizedText.trim()) {
      return;
    }

    setDownloadingPdf(true);
    setToast(null);

    try {
      const response = await axios.post(
        apiUrl("/api/parser/generate-pdf"),
        { text: optimizedText },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "optimized-resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      setToast({
        type: "error",
        message: "PDF generation failed. Please try again.",
      });
    } finally {
      setDownloadingPdf(false);
    }
  }

  async function handleSendEmail(event) {
    event.preventDefault();

    if (!hrEmail.trim() || !optimizedText.trim()) {
      return;
    }

    setSendingEmail(true);
    setToast(null);

    try {
      const response = await axios.post(apiUrl("/api/job-applications/apply-optimized"), {
        hrEmail: hrEmail.trim(),
        jobTitle: DEFAULT_SUBJECT,
        finalResumeText: optimizedText,
      });

      setToast({
        type: "success",
        message: extractServerMessage(
          response.data,
          "Application sent successfully."
        ),
      });
      setIsEmailModalOpen(false);
      setHrEmail("");
    } catch (error) {
      setToast({
        type: "error",
        message: axios.isAxiosError(error)
          ? extractServerMessage(
              error.response?.data,
              "Email dispatch failed. Please try again."
            )
          : "Email dispatch failed. Please try again.",
      });
    } finally {
      setSendingEmail(false);
    }
  }

  const canOptimize = useMemo(
    () =>
      resumeStatus === "ready" &&
      (jobStatus === "ready" || jobStatus === "manual") &&
      extractedResumeText.trim().length > 0 &&
      extractedJobText.trim().length > 0 &&
      optimizeState !== "loading",
    [extractedJobText, extractedResumeText, jobStatus, optimizeState, resumeStatus]
  );

  const currentStep = useMemo(() => {
    if (!resumeFile && resumeStatus !== "ready") {
      return 1;
    }

    if (!extractedJobText.trim()) {
      return 2;
    }

    return 3;
  }, [extractedJobText, resumeFile, resumeStatus]);

  const completedSteps = useMemo(
    () => [
      ...(resumeStatus === "ready" ? [1] : []),
      ...((jobStatus === "ready" || jobStatus === "manual") && extractedJobText.trim() ? [2] : []),
      ...(canOptimize ? [3] : []),
    ],
    [canOptimize, extractedJobText, jobStatus, resumeStatus]
  );

  function handlePasteJobDescription(value) {
    setJobDescriptionInput(value);
    setJobError("");
    setOptimizeError("");

    if (value.trim()) {
      setJobFile(null);
      setExtractedJobText(value.trim());
      setJobStatus("manual");
    } else {
      setExtractedJobText("");
      setJobStatus("idle");
    }
  }

  const showEditor = optimizeState === "done" && optimizedText.trim().length > 0;

  return (
    <DashboardLayout brandTag="AI resume studio" mobileEyebrow="SmartJob AI optimizer">
      <section className="optimizer-page">
        <div className="optimizer-hero">
          <div className="optimizer-hero__glow" aria-hidden />
          <div className="optimizer-hero__content">
            <p className="optimizer-hero__eyebrow">Premium AI resume optimizer</p>
            <h1>
              Transform your resume
              <br />
              into a <span className="optimizer-hero__nowrap">job-winning</span> asset
            </h1>
            <p className="optimizer-hero__copy">
              Upload your resume and job description — our AI refines your
              profile to match what recruiters are actually looking for.
            </p>
            <p className="optimizer-hero__highlight">
              ⚡ AI-powered matching • Instant optimization • Recruiter-ready
              format
            </p>
          </div>

          <div className="optimizer-hero__visual" aria-hidden>
            <div className="optimizer-hero__visual-glow" />

            <div className="optimizer-flow-card optimizer-flow-card--input">
              <div className="optimizer-flow-card__icon">
                <ResumeFileIcon />
              </div>
              <div className="optimizer-flow-card__body">
                <span className="optimizer-flow-card__label">Resume.pdf</span>
                <span className="optimizer-flow-card__meta">Raw candidate profile</span>
              </div>
            </div>

            <div className="optimizer-flow-link optimizer-flow-link--left">
              <span className="optimizer-flow-link__line" />
              <span className="optimizer-flow-link__particle" />
            </div>

            <div className="optimizer-ai-core">
              <div className="optimizer-ai-core__ring" />
              <div className="optimizer-ai-core__center">
                <AiCoreIcon />
              </div>
            </div>

            <div className="optimizer-flow-link optimizer-flow-link--right">
              <span className="optimizer-flow-link__line" />
              <span className="optimizer-flow-link__particle" />
            </div>

            <div className="optimizer-flow-card optimizer-flow-card--output">
              <div className="optimizer-flow-card__icon">
                <OptimizedFileIcon />
              </div>
              <div className="optimizer-flow-card__body">
                <span className="optimizer-flow-card__label">Optimized Resume</span>
                <span className="optimizer-flow-card__meta">
                  Tailored recruiter-ready draft
                </span>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className={`optimizer-toast optimizer-toast--${toastTone(toast.type)}`} role="status">
            {toast.message}
          </div>
        )}

        {optimizeError && (
          <div className="dash-alert" role="alert">
            <strong>AI optimization failed</strong>
            {optimizeError}
          </div>
        )}

        {!showEditor && (
          <div className="optimizer-stage-card">
            {optimizeState === "loading" ? (
              <div className="optimizer-loading-state" aria-live="polite">
                <div className="optimizer-spinner" aria-hidden />
                <h2>Optimizing your resume with AI</h2>
                <p>We’re matching your extracted resume text against the uploaded job description.</p>
                <div className="optimizer-loading-state__skeletons" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : (
              <>
                <div className="optimizer-flow-shell">
                  <StepIndicator
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                  />

                  <div className="optimizer-step-stack">
                    <StepUploadCard
                      stepTitle="Step 1 — Upload Resume"
                      file={resumeFile}
                      status={resumeStatus}
                      error={resumeError}
                      inputRef={resumeInputRef}
                      onPick={(file) => extractFileText(file, "resume")}
                      onDropFile={(file) => extractFileText(file, "resume")}
                    />

                    <StepUploadCard
                      stepTitle="Step 2 — Upload Job Description"
                      file={jobFile}
                      status={jobStatus}
                      error={jobError}
                      inputRef={jobInputRef}
                      onPick={(file) => extractFileText(file, "job")}
                      onDropFile={(file) => extractFileText(file, "job")}
                      disabled={resumeStatus !== "ready"}
                      allowPaste
                      pastedValue={jobDescriptionInput}
                      onPasteChange={handlePasteJobDescription}
                    />

                    <div className="optimizer-step-action">
                      <p className="optimizer-step-action__title">
                        Step 3 — Optimize
                      </p>
                      <button
                        type="button"
                        className={`optimizer-primary-btn optimizer-primary-btn--step${canOptimize ? " is-active" : ""}`}
                        disabled={!canOptimize}
                        onClick={handleOptimize}
                      >
                        ✨ Optimize Resume
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {showEditor && (
          <div className="optimizer-editor-shell">
            <div className="optimizer-editor-bar">
              <div>
                <p className="optimizer-editor-bar__eyebrow">Interactive results</p>
                <h2>Your AI-optimized resume draft</h2>
              </div>

              <div className="optimizer-editor-actions">
                <button
                  type="button"
                  className="dash-btn"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                >
                  {downloadingPdf ? "Preparing PDF…" : "📄 Download PDF"}
                </button>

                <button
                  type="button"
                  className={`dash-btn${isEditable ? " optimizer-toggle-btn--active" : ""}`}
                  onClick={() => setIsEditable((current) => !current)}
                >
                  ✏️ {isEditable ? "Editing On" : "Edit"}
                </button>

                <button
                  type="button"
                  className="optimizer-primary-btn optimizer-primary-btn--compact"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  ✉️ Email to HR
                </button>
              </div>
            </div>

            <textarea
              className={`optimizer-editor${isEditable ? "" : " optimizer-editor--readonly"}`}
              value={optimizedText}
              onChange={(event) => setOptimizedText(event.target.value)}
              readOnly={!isEditable}
              spellCheck={false}
            />
          </div>
        )}
      </section>

      {isEmailModalOpen && (
        <div
          className="optimizer-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!sendingEmail) {
              setIsEmailModalOpen(false);
            }
          }}
        >
          <div
            className="optimizer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="optimizer-email-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="optimizer-modal__header">
              <div>
                <p className="optimizer-modal__eyebrow">Email dispatch</p>
                <h2 id="optimizer-email-title">Send the optimized application</h2>
              </div>

              <button
                type="button"
                className="optimizer-modal__close"
                onClick={() => setIsEmailModalOpen(false)}
                disabled={sendingEmail}
                aria-label="Close email modal"
              >
                ×
              </button>
            </div>

            <form className="optimizer-modal__form" onSubmit={handleSendEmail}>
              <label className="optimizer-field">
                <span>HR / Recruiter Email Address</span>
                <input
                  type="email"
                  value={hrEmail}
                  onChange={(event) => setHrEmail(event.target.value)}
                  placeholder="recruiter@company.com"
                  required
                />
              </label>

              <label className="optimizer-field">
                <span>Email Subject</span>
                <input type="text" value={DEFAULT_SUBJECT} readOnly />
              </label>

              <label className="optimizer-field">
                <span>Email Template Preview</span>
                <textarea value={DEFAULT_TEMPLATE} readOnly />
              </label>

              <button
                type="submit"
                className="optimizer-primary-btn optimizer-primary-btn--full"
                disabled={sendingEmail}
              >
                {sendingEmail ? "Sending…" : "🚀 Blast Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 16V7m0 0-3 3m3-3 3 3M5 16.5v1A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResumeFileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5H8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5V8h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AiCoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 3 1.7 4.7L18.5 9.5l-4.8 1.8L12 16l-1.7-4.7L5.5 9.5l4.8-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OptimizedFileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5H8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 13 1.8 1.8 3.7-4.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AiOptimizer;
