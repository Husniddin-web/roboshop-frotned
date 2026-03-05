"use client";

import { useState, useEffect } from "react";
import { motion } from "@/lib/no-motion";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiDownload,
  FiUpload,
} from "react-icons/fi";

interface TranslationData {
  [key: string]: string;
}

interface ContentData {
  uz: TranslationData;
  ru: TranslationData;
}

const CONTENT_FIELDS = {
  hero: {
    title: "Hero Section",
    fields: [
      { key: "hero.title", label: "Hero Title", type: "input" as const },
      {
        key: "hero.description",
        label: "Hero Description",
        type: "textarea" as const,
        rows: 2,
      },
      { key: "hero.button", label: "Hero Button Text", type: "input" as const },
    ],
  },
  arduino: {
    title: "Arduino Information",
    fields: [
      {
        key: "arduino.what",
        label: "Arduino What Title",
        type: "input" as const,
      },
      {
        key: "arduino.what.text",
        label: "Arduino What Description",
        type: "textarea" as const,
        rows: 4,
      },
      {
        key: "arduino.why",
        label: "Arduino Why Title",
        type: "input" as const,
      },
      {
        key: "arduino.why.text",
        label: "Arduino Why Description",
        type: "textarea" as const,
        rows: 4,
      },
    ],
  },
  content: {
    title: "Additional Content",
    fields: [
      {
        key: "useful.content",
        label: "Useful Content",
        type: "textarea" as const,
        rows: 6,
      },
    ],
  },
};

export default function ContentManager() {
  const { t, i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<"uz" | "ru">("uz");
  const [content, setContent] = useState<ContentData>({ uz: {}, ru: {} });
  const [originalContent, setOriginalContent] = useState<ContentData>({
    uz: {},
    ru: {},
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadContentFromFiles();
  }, []);

  useEffect(() => {
    const hasContentChanged =
      JSON.stringify(content) !== JSON.stringify(originalContent);
    setHasChanges(hasContentChanged);
  }, [content, originalContent]);

  const loadContentFromFiles = async () => {
    setLoading(true);
    const loadToastId = showToast.loading("Loading translations...");

    try {
      const response = await fetch("/api/translations");
      const result = await response.json();
      if (result.success) {
        setContent(result.data);
        setOriginalContent(result.data);
        setHasChanges(false);
        setErrors({});
        showToast.update(
          loadToastId,
          "success",
          "Translations loaded successfully"
        );
      } else {
        throw new Error(result.error || "Failed to load translations");
      }
    } catch (error) {
      showToast.update(loadToastId, "error", "Failed to load translations");
    } finally {
      setLoading(false);
    }
  };

  const validateContent = (lang: "uz" | "ru"): boolean => {
    const newErrors: Record<string, string> = {};
    const langContent = content[lang];

    const allFields = Object.values(CONTENT_FIELDS).flatMap(
      (section) => section.fields
    );

    allFields.forEach((field) => {
      const value = langContent[field.key] || "";
      if (!value || value.trim().length === 0) {
        newErrors[`${lang}.${field.key}`] = `${field.label} cannot be empty`;
      } else if (value.trim().length < 3) {
        newErrors[
          `${lang}.${field.key}`
        ] = `${field.label} must be at least 3 characters`;
      }
    });

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateAllContent = (): boolean => {
    const uzValid = validateContent("uz");
    const ruValid = validateContent("ru");
    return uzValid && ruValid;
  };

  const handleContentChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [activeLanguage]: {
        ...prev[activeLanguage],
        [field]: value,
      },
    }));

    const errorKey = `${activeLanguage}.${field}`;
    if (errors[errorKey] && value.trim().length >= 3) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!validateAllContent()) {
      showToast.error("Please fix all validation errors before saving");
      return;
    }

    setSaving(true);
    const saveToastId = showToast.loading("Saving translations...");

    try {
      const response = await fetch("/api/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          translations: content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        handleReload();

        setOriginalContent(content);
        setHasChanges(false);
        showToast.update(
          saveToastId,
          "success",
          "Translations saved successfully!"
        );
      } else {
        throw new Error(result.error || "Failed to save translations");
      }
    } catch (error) {
      console.error("Error saving translations:", error);
      showToast.update(saveToastId, "error", "Failed to save translations");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (hasChanges) {
      if (confirm("Are you sure you want to discard all changes?")) {
        setContent(originalContent);
        setErrors({});
        setHasChanges(false);
        showToast.info("Changes discarded");
      }
    }
  };

  const handleReload = async () => {
    await loadContentFromFiles();
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[`${activeLanguage}.${field}`];
  };

  const renderField = (field: {
    key: string;
    label: string;
    type: "input" | "textarea";
    rows?: number;
  }) => {
    const value = content[activeLanguage][field.key] || "";
    const error = getFieldError(field.key);
    const hasError = !!error;

    return (
      <div key={field.key}>
        <label
          className="block text-sm font-semibold mb-2"
          style={{
            color: "#ffffff",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {field.label}
          {hasError && (
            <span className="ml-2 text-red-400">
              <FiAlertCircle size={14} className="inline" />
            </span>
          )}
        </label>

        {field.type === "input" ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleContentChange(field.key, e.target.value)}
            className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: `2px solid ${
                hasError ? "#ef4444" : "rgba(255, 255, 255, 0.1)"
              }`,
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = hasError ? "#ef4444" : "#ffffff";
              e.target.style.boxShadow = `0 0 0 3px ${
                hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = hasError
                ? "#ef4444"
                : "rgba(255, 255, 255, 0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => handleContentChange(field.key, e.target.value)}
            rows={field.rows || 3}
            className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 resize-none"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: `2px solid ${
                hasError ? "#ef4444" : "rgba(255, 255, 255, 0.1)"
              }`,
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = hasError ? "#ef4444" : "#ffffff";
              e.target.style.boxShadow = `0 0 0 3px ${
                hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = hasError
                ? "#ef4444"
                : "rgba(255, 255, 255, 0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        )}

        {hasError && (
          <p
            className="mt-2 text-sm"
            style={{
              color: "#ef4444",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="rounded-lg p-12 shadow-lg text-center"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <motion.div
          className="loading mx-auto"
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.2)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <p
          className="mt-4 text-lg"
          style={{
            color: "#ffffff",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
          }}
        >
          Loading translations...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-lg p-6 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#ffffff",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Translation Manager
        </h2>

        <div className="flex items-center gap-4">
          {hasChanges && (
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(234, 179, 8, 0.2)",
                color: "#eab308",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              }}
            >
              UNSAVED CHANGES
            </div>
          )}

          <motion.button
            onClick={handleReload}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              fontSize: "0.875rem",
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload size={14} />
            Reload
          </motion.button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <div className="flex gap-4 mb-6">
          <motion.button
            onClick={() => setActiveLanguage("uz")}
            className="px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background:
                activeLanguage === "uz"
                  ? "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)"
                  : "rgba(255, 255, 255, 0.05)",
              color: activeLanguage === "uz" ? "#000000" : "#ffffff",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Uzbek ({Object.keys(content.uz).length} keys)
          </motion.button>
          <motion.button
            onClick={() => setActiveLanguage("ru")}
            className="px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              background:
                activeLanguage === "ru"
                  ? "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)"
                  : "rgba(255, 255, 255, 0.05)",
              color: activeLanguage === "ru" ? "#000000" : "#ffffff",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Russian ({Object.keys(content.ru).length} keys)
          </motion.button>
        </div>
      </div>

      {/* Content Form */}
      <div
        className="p-6 rounded-lg space-y-8"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {Object.entries(CONTENT_FIELDS).map(([sectionKey, section]) => (
          <div
            key={sectionKey}
            className="p-4 rounded-lg space-y-4"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{
                color: "#ffffff",
                fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {section.title}
            </h3>

            <div className="space-y-4">{section.fields.map(renderField)}</div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <motion.button
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200"
            style={{
              background: !hasChanges
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(255, 255, 255, 0.05)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              color: !hasChanges ? "#666666" : "#ffffff",
              cursor: !hasChanges ? "not-allowed" : "pointer",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
            whileHover={
              hasChanges
                ? { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }
                : {}
            }
            whileTap={hasChanges ? { scale: 0.95 } : {}}
          >
            <FiRefreshCw size={16} />
            Reset
          </motion.button>

          <motion.button
            onClick={handleSave}
            disabled={saving || !hasChanges || Object.keys(errors).length > 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200"
            style={{
              background:
                saving || !hasChanges || Object.keys(errors).length > 0
                  ? "rgba(255, 255, 255, 0.03)"
                  : "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
              color:
                saving || !hasChanges || Object.keys(errors).length > 0
                  ? "#666666"
                  : "#000000",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              cursor:
                saving || !hasChanges || Object.keys(errors).length > 0
                  ? "not-allowed"
                  : "pointer",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            whileHover={
              !saving && hasChanges && Object.keys(errors).length === 0
                ? {
                    scale: 1.05,
                    background:
                      "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                    color: "#ffffff",
                  }
                : {}
            }
            whileTap={
              !saving && hasChanges && Object.keys(errors).length === 0
                ? { scale: 0.95 }
                : {}
            }
          >
            {saving ? (
              <motion.div
                className="loading"
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ) : (
              <FiUpload size={16} />
            )}
            {saving ? "Saving..." : "Save Translations"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
