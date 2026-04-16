import { IoSearchSharp } from "react-icons/io5";

export default function SearchMarketPlace({
  placeholder = "Search",
  value,
}: {
  placeholder: string;
  value: string;
}) {
  return (
    <div className="w-full sm:w-[80%] lg:w-[50%] rounded-[8px] flex gap-2.5 py-2.5 sm:py-3 px-3 sm:px-4 border-[0.5px] bg-[#FFFFFF12] text-[#B7B7B98C] border-[#D6D6D64F] items-center">
      <IoSearchSharp className="size-5 sm:size-6 text-white" />
      <input
        value={value}
        type="text"
        placeholder={placeholder}
        className="border-0 outline-0 w-full text-sm sm:text-base"
      />
    </div>
  );
}

// Todo: Change all search in marketplace to use this
