"use client";

import type React from "react";
import { useState, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { useDeleteImage, useUploadImage } from "@/lib/api";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/features/authSlice";
import { removeAccessToken } from "@/lib/cookies";
import { useTranslation } from "react-i18next";
import { motion } from "@/lib/no-motion";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const { mutateAsync: uploadImageMutation } = useUploadImage();
  const { mutateAsync: removeImageMutation } = useDeleteImage();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      showToast.warning(`${t("maximum")} ${maxImages} ${t("images.allowed")}`);
      return;
    }

    setUploading(true);
    const uploadToastId = showToast.loading(t("uploading.images"));

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const result = await uploadImageMutation(formData);
      if (result?.status_code === 200) {
        onImagesChange([...images, ...result.data]);
        showToast.update(
          uploadToastId,
          "success",
          `${result.data.length} ${t("images.uploaded.successfully")}`
        );
      } else {
        dispatch(logout());
        showToast.update(
          uploadToastId,
          "error",
          `${t("upload.failed")}: ${result.error}`
        );
      }
    } catch {
      showToast.update(uploadToastId, "error", t("upload.failed"));
      dispatch(logout());
      removeAccessToken();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    const deleteToastId = showToast.loading(t("deleting.image"));
    try {
      const res = await removeImageMutation(imageToRemove);
      if (res?.status_code === 200) {
        onImagesChange(images.filter((_, i) => i !== index));
        showToast.update(
          deleteToastId,
          "success",
          t("image.deleted.successfully")
        );
      } else {
        dispatch(logout());
        showToast.update(
          deleteToastId,
          "error",
          `${t("delete. failed")}: ${res.error}`
        );
      }
    } catch {
      dispatch(logout());
      removeAccessToken();
      showToast.update(deleteToastId, "error", t("delete.failed"));
    }
  };

  return (
    <div className="space-y-4">
      <label
        className="block text-sm font-semibold"
        style={{
          color: "#ffffff",
          fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {t("images")} ({images.length}/{maxImages})
      </label>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          disabled={uploading || images.length >= maxImages}
        />

        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            background:
              uploading || images.length >= maxImages
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(255, 255, 255, 0.05)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            color:
              uploading || images.length >= maxImages ? "#666666" : "#ffffff",
            cursor:
              uploading || images.length >= maxImages
                ? "not-allowed"
                : "pointer",
            fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: "600",
          }}
          whileHover={
            !uploading && images.length < maxImages
              ? {
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              : {}
          }
          whileTap={
            !uploading && images.length < maxImages ? { scale: 0.95 } : {}
          }
        >
          {uploading ? (
            <motion.div
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
          {uploading ? t("uploading") : t("upload.images")}
        </motion.button>
      </div>

      {images.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "1rem",
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative rounded-lg overflow-hidden"
              style={{
                aspectRatio: "1",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.03)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={`${BASE_URL}/uploads/${image}`}
                alt={`Product image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <motion.button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(239, 68, 68, 0.8)",
                  color: "white",
                  border: "none",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(239, 68, 68, 1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={14} />
              </motion.button>

              {index === 0 && (
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("main")}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-lg p-8 text-center"
          style={{
            border: "2px dashed rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <FiImage
            size={48}
            style={{
              margin: "0 auto 1rem",
              color: "#666666",
            }}
          />
          <p
            style={{
              color: "#a0a0a0",
              fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
            }}
          >
            {t("no.images.uploaded")}
          </p>
        </div>
      )}
    </div>
  );
}
