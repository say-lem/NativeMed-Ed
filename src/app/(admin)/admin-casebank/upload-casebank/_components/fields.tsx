"use client";
import { useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useController,
  useFormContext,
  type UseFormRegisterReturn,
} from "react-hook-form";
import RichTextEditor from "@/components/shared/RichTextEditor";

export const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

export function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-normal leading-[120%] tracking-[-0.01em] text-[#080A0D]">
      {text}
      {required && <span className="text-[#E5102E]">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-[#E5102E] mt-1 leading-[150%]">{message}</p>;
}

export function SectionHeading({ text }: { text: string }) {
  return (
    <h2 className="text-lg sm:text-xl font-semibold leading-[130%] tracking-[-2%] text-black-others">
      {text}
    </h2>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 border-[0.5px] border-[#B7B7B9] rounded-[12px] flex flex-col gap-6">
      {children}
    </div>
  );
}

type FieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export function TextField({
  label,
  registration,
  error,
  placeholder,
  required,
  type = "text",
}: FieldProps & { type?: string }) {
  return (
    <div className="space-y-2">
      <Label text={label} required={required} />
      <input
        type={type}
        placeholder={placeholder}
        className={fieldClass}
        {...registration}
      />
      <FieldError message={error} />
    </div>
  );
}

/** Rich-text (Word-like) field bound to a RHF field by name; stores markdown. */
export function MarkdownField({
  name,
  label,
  error,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { control } = useFormContext();
  const { field } = useController({ name, control });
  return (
    <div className="space-y-2">
      <Label text={label} required={required} />
      <RichTextEditor
        value={field.value ?? ""}
        onChange={field.onChange}
        placeholder={placeholder}
      />
      <FieldError message={error} />
    </div>
  );
}

export function TextArea({
  label,
  registration,
  error,
  placeholder,
  required,
  rows = 4,
}: FieldProps & { rows?: number }) {
  return (
    <div className="space-y-2">
      <Label text={label} required={required} />
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={`${fieldClass} resize-none`}
        {...registration}
      />
      <FieldError message={error} />
    </div>
  );
}

export function SelectField({
  label,
  registration,
  error,
  placeholder,
  required,
  options,
}: FieldProps & { options: string[] }) {
  return (
    <div className="space-y-2">
      <Label text={label} required={required} />
      <div className="relative">
        <select
          className={`${fieldClass} appearance-none pr-10 cursor-pointer`}
          {...registration}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-black-others">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black-others"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function NumberField({
  label,
  registration,
  error,
  placeholder,
  required,
}: FieldProps) {
  const localRef = useRef<HTMLInputElement | null>(null);
  const { ref: rhfRef, ...rest } = registration;
  return (
    <div className="space-y-2">
      <Label text={label} required={required} />
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          ref={(el) => {
            localRef.current = el;
            rhfRef(el);
          }}
          {...rest}
          className={`${fieldClass} pr-10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col text-black-others">
          <button
            type="button"
            aria-label="Increase"
            onClick={() => localRef.current?.stepUp()}
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => localRef.current?.stepDown()}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      <FieldError message={error} />
    </div>
  );
}
