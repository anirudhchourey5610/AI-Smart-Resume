import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config/api";
import "./Dashboard.css";
import "./ResumeVault.css";

function badgeTone(type) {
  return String(type).toLowerCase() === "optimized" ? "optimized" : "original";
}

function ResumeVault() {
  const { token } = useAuth();
  const inputRef = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({
      id: Date.now(),
      type,
      message,
    });
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const authHeaders = useMemo(() => {
    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const fetchResumes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(apiUrl("/api/resumes"), {
        headers: authHeaders,
      });

      setResumes(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      const status = axios.isAxiosError(requestError)
        ? requestError.response?.status
        : null;

      showToast("error", "Something went wrong");
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, showToast]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpload = useCallback(
    async (file) => {
      if (!file) {
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(apiUrl("/api/resumes/upload"), formData, {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        });

        showToast("success", "Resume uploaded successfully");
        await fetchResumes();
      } catch (requestError) {
        showToast("error", "Something went wrong");
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [authHeaders, fetchResumes, showToast]
  );

  const handleDownload = useCallback(
    async (resume) => {
      if (!resume.fileName) {
        showToast("error", "Something went wrong");
        return;
      }

      const encodedFileName = encodeURIComponent(resume.fileName);
      const url = apiUrl(`/api/resumes/download/${encodedFileName}`);

      setActionId(`download-${resume.fileName}`);

      try {
        const response = await axios.get(url, {
          headers: authHeaders,
          responseType: "blob",
        });

        const blob = new Blob([response.data]);
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = resume.fileName || "resume";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(objectUrl);
      } catch (requestError) {
        showToast("error", "Something went wrong");
      } finally {
        setActionId("");
      }
    },
    [authHeaders, showToast]
  );

  const handleDelete = useCallback(
    async (resumeFileName) => {
      if (!resumeFileName) {
        showToast("error", "Something went wrong");
        return;
      }

      const encodedFileName = encodeURIComponent(resumeFileName);

      setActionId(`delete-${resumeFileName}`);

      try {
        await axios.delete(apiUrl(`/api/resumes/${encodedFileName}`), {
          headers: authHeaders,
        });

        showToast("success", "Resume deleted successfully");
        await fetchResumes();
      } catch (requestError) {
        showToast("error", "Something went wrong");
      } finally {
        setActionId("");
      }
    },
    [authHeaders, fetchResumes, showToast]
  );

  return (
    <DashboardLayout brandTag="Resume vault" mobileEyebrow="SmartJob resume vault">
      <section className="resume-vault-page">
        {toast && (
          <div className="resume-vault-toast-stack" aria-live="polite">
            <div
              key={toast.id}
              className={`resume-vault-toast resume-vault-toast--${toast.type}`}
              role="status"
            >
              {toast.message}
            </div>
          </div>
        )}

        <header className="glass-panel resume-vault-hero">
          <div>
            <p className="dash-section-heading__eyebrow">Resume management</p>
            <h1>Your Resume Vault</h1>
            <p className="resume-vault-hero__subtitle">
              Manage your uploaded and AI-optimized resumes
            </p>
          </div>

          <div className="resume-vault-hero__actions">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="resume-vault-upload-input"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />

            <button
              type="button"
              className="resume-vault-upload-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "+ Upload Resume"}
            </button>
          </div>
        </header>

        {loading ? (
          <section className="resume-vault-grid" aria-hidden>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="resume-vault-card resume-vault-card--skeleton" />
            ))}
          </section>
        ) : resumes.length === 0 ? (
          <section className="glass-panel resume-vault-empty">
            <div className="resume-vault-empty__icon">
              <ResumeFileIcon />
            </div>
            <h2>No resumes yet</h2>
            <p>Upload your first resume to get started</p>
            <button
              type="button"
              className="resume-vault-upload-btn resume-vault-upload-btn--inline"
              onClick={() => inputRef.current?.click()}
            >
              Upload Resume
            </button>
          </section>
        ) : (
          <section className="resume-vault-grid">
            {resumes.map((resume) => {
              const tone = badgeTone(resume.type);
              const resumeKey = resume.id ?? resume.fileName;
              const isDownloading = actionId === `download-${resume.fileName}`;
              const isDeleting = actionId === `delete-${resume.fileName}`;

              return (
                <article key={resumeKey} className="resume-vault-card">
                  <div className="resume-vault-card__top">
                    <div className="resume-vault-card__icon">
                      <ResumeFileIcon />
                    </div>
                    <span className={`resume-vault-badge resume-vault-badge--${tone}`}>
                      {tone === "optimized" ? "Optimized" : "Original"}
                    </span>
                  </div>

                  <div className="resume-vault-card__body">
                    <h2>{resume.fileName}</h2>
                    <p>{resume.uploadDate || "Unknown date"}</p>
                  </div>

                  <div className="resume-vault-card__actions">
                    <button
                      type="button"
                      className="resume-vault-card__btn"
                      onClick={() => handleDownload(resume)}
                      disabled={isDownloading || isDeleting}
                    >
                      {isDownloading ? "Downloading..." : "Download"}
                    </button>

                    <button
                      type="button"
                      className="resume-vault-card__btn resume-vault-card__btn--danger"
                      onClick={() => handleDelete(resume.fileName)}
                      disabled={isDownloading || isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </DashboardLayout>
  );
}

function ResumeFileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.75h5.5L19 9.25v10A1.75 1.75 0 0 1 17.25 21h-9.5A1.75 1.75 0 0 1 6 19.25v-13.5A1.75 1.75 0 0 1 7.75 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.75v4.5A1 1 0 0 0 14.5 9.25H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ResumeVault;
