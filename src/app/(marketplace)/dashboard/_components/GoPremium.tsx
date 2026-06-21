export default function GoPremium() {
  return (
    <div className="rounded-[14px] bg-[#1C1C1C] p-5 sm:p-6 text-white space-y-3">
      <h3 className="text-xl font-semibold leading-[130%] tracking-[-2%]">
        Go Premium
      </h3>
      <p className="text-sm leading-[150%] text-[#C9C9C9]">
        Get full access to all lectures & mock session recordings.
      </p>
      <button
        type="button"
        className="mt-2 rounded-[8px] bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer hover:bg-primary-100/90"
      >
        Get Full Access
      </button>
    </div>
  );
}
