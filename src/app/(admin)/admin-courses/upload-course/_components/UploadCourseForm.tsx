import { ChevronDown, ChevronUp, Upload } from "lucide-react";

const fieldClass =
  "w-full rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm text-black-others placeholder:text-[#B7B7B9] outline-none focus:border-primary-100";

// Cover image — only image formats.
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

// Course material — document formats (pdf, doc/docx, ppt/pptx). Both file
// extensions and MIME types are listed for cross-browser coverage.
const DOC_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
].join(",");

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-normal leading-[120%] tracking-[-0.01em] text-[#080A0D]">
      {text}
      {required && <span className="text-[#E5102E]">*</span>}
    </label>
  );
}

function SelectField({
  placeholder,
  options,
  required,
}: {
  placeholder: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        required={required}
        className={`${fieldClass} appearance-none pr-10 cursor-pointer ${
          required ? "text-[#B7B7B9] valid:text-black-others" : "text-black-others"
        }`}
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
  );
}

export default function UploadCourseForm() {
  return (
    <section className="sm:px-6 lg:px-10 mb-10 px-4">
      <form className="mt-14 p-6 border-[#B7B7B9] border-[0.5px] rounded-[12px] flex flex-col gap-6">
        {/* Cover */}
        <div className="space-y-2">
          <Label text="Cover" />
          <label className="flex flex-col items-center justify-center gap-2 rounded-[8px] border-[0.5px] border-[#B7B7B9] py-10 cursor-pointer text-center">
            <span className="size-12 rounded-full bg-primary-10 flex items-center justify-center">
              <Upload className="size-5 text-primary-100" />
            </span>
            <span className="text-sm text-subtle-text">Upload or drag image</span>
            <input type="file" accept={IMAGE_ACCEPT} className="hidden" />
          </label>
        </div>

        {/* Title + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label text="Course Title" required />
            <input
              type="text"
              placeholder="Eg. Native MRCGP SCA Extensive Course"
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label text="Category" required />
            <SelectField
              placeholder="Select Category"
              required
              options={["Course", "Session", "Webinar"]}
            />
          </div>
        </div>

        {/* Price + Payment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label text="Price" />
            <input type="text" placeholder="£19.99" className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label text="Payment Type" />
            <SelectField
              placeholder="Select Payment Type"
              options={["One-time", "Subscription", "Free"]}
            />
          </div>
        </div>

        {/* Material */}
        <div className="space-y-2">
          <Label text="Material" />
          <label className="flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 cursor-pointer">
            <span className="text-sm text-[#B7B7B9]">Attach pdf file</span>
            <span className="size-6 rounded-[4px] border-[0.5px] border-[#B7B7B9] flex items-center justify-center shrink-0">
              <ChevronUp size={14} className="text-black-others" />
            </span>
            <input type="file" accept={DOC_ACCEPT} className="hidden" />
          </label>
        </div>

        {/* Course Link */}
        <div className="space-y-2">
          <Label text="Course Link" />
          <input
            type="url"
            placeholder="Attach course link"
            className={fieldClass}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label text="Description" />
          <textarea
            rows={4}
            placeholder="Enter short description of course"
            className={`${fieldClass} resize-none`}
          />
        </div>
      </form>
    </section>
  );
}
