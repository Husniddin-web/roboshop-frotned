"use client";

import React, { useState, useRef, DragEvent } from "react";
import { FiUploadCloud, FiTrash2, FiImage, FiCheckCircle } from "react-icons/fi";
import { showToast } from "@/lib/toast";
import { useUploadImage, useDeleteImage } from "@/lib/api";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const { mutateAsync: uploadImageMutation } = useUploadImage();
  const { mutateAsync: removeImageMutation } = useDeleteImage();

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (fileArray.length === 0) {
      showToast.warning("Iltimos, faqat rasm fayllarini tanlang (JPG, PNG, WEBP)");
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      showToast.warning(`Maksimal ${maxImages} ta rasm yuklash mumkin`);
      return;
    }

    setUploading(true);
    const toastId = showToast.loading("Rasmlar yuklanmoqda...");

    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("files", file);
      });

      const res = await uploadImageMutation(formData);
      if (res?.data && Array.isArray(res.data)) {
        onImagesChange([...images, ...res.data]);
        showToast.update(
          toastId,
          "success",
          `${res.data.length} ta rasm muvaffaqiyatli yuklandi`
        );
      } else {
        showToast.update(toastId, "error", "Rasmlarni yuklashda xatolik yuz berdi");
      }
    } catch {
      showToast.update(toastId, "error", "Rasmlarni yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    // Optimistically remove from form state
    onImagesChange(images.filter((_, i) => i !== index));

    try {
      if (imageToRemove) {
        await removeImageMutation(imageToRemove);
      }
    } catch {
      // Ignored silently as UI state is already updated
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">
            Mahsulot rasmlari
          </span>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            JPG, PNG yoki WEBP (birinchi rasm asosiy muqova bo'ladi)
          </p>
        </div>
        <span
          className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            images.length >= maxImages
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-white/5 text-zinc-400 border-white/10"
          }`}
        >
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || images.length >= maxImages}
      />

      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 ${
            isDragOver
              ? "border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
          } ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
              isDragOver
                ? "bg-amber-400 text-black"
                : "bg-white/5 text-zinc-400 group-hover:text-white"
            }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiUploadCloud size={24} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {uploading ? (
                "Rasmlar yuklanmoqda..."
              ) : (
                <>
                  <span className="text-amber-400 underline underline-offset-4 decoration-amber-400/30 group-hover:decoration-amber-400">
                    Rasm tanlang
                  </span>{" "}
                  yoki bu yerga sudrab tashlang
                </>
              )}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Maksimal hajm: 5MB gacha</p>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {images.map((image, index) => {
            const isMain = index === 0;
            const fullUrl = image.startsWith("http")
              ? image
              : `${BASE_URL}/uploads/${image}`;

            return (
              <div
                key={image || index}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border transition-all ${
                  isMain
                    ? "border-amber-400/80 ring-2 ring-amber-400/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <img
                  src={fullUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image failed to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />

                {/* Main badge */}
                {isMain && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-bold font-mono uppercase shadow-md">
                    <FiCheckCircle size={10} />
                    <span>Asosiy</span>
                  </div>
                )}

                {/* Overlay with Delete button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-all hover:scale-110 shadow-lg"
                    title="Rasmni o'chirish"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
