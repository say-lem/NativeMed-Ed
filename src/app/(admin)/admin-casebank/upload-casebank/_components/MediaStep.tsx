"use client";
import { Upload } from "lucide-react";
import { FormCard, Label, SectionHeading } from "./fields";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

function ImagePicker({
  label,
  hint,
  preview,
  onSelect,
}: {
  label: string;
  hint?: string;
  preview?: string;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <Label text={label} />
      <label className="relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[8px] border-[0.5px] border-[#B7B7B9] py-10 text-center">
        {preview && (
          <span
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        )}
        <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary-10">
          <Upload className="size-5 text-primary-100" />
        </span>
        <span className="relative z-10 rounded bg-white/80 px-2 text-sm text-subtle-text">
          {preview ? "Change image" : "Upload or drag image"}
        </span>
        {hint && (
          <span className="relative z-10 rounded bg-white/80 px-2 text-xs text-[#B7B7B9]">
            {hint}
          </span>
        )}
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={onSelect}
        />
      </label>
    </div>
  );
}

export default function MediaStep({
  coverPreview,
  stationPreview,
  onCover,
  onStation,
}: {
  coverPreview?: string;
  stationPreview?: string;
  onCover: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStation: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <FormCard>
      <SectionHeading text="Case Images" />
      <p className="-mt-3 text-sm text-subtle-text">
        Optional. JPG, PNG or WEBP up to 5MB. The cover shows on the case card;
        the station image appears inside the station.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImagePicker
          label="Cover image"
          hint="Recommended 800×450"
          preview={coverPreview}
          onSelect={onCover}
        />
        <ImagePicker
          label="Station image"
          hint="Recommended 800×600"
          preview={stationPreview}
          onSelect={onStation}
        />
      </div>
    </FormCard>
  );
}
