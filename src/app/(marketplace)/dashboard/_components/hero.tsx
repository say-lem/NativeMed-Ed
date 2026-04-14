export default function DashboardHero() {
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="bg-[#2D135C] w-full rounded-[14px] p-4 sm:p-6 lg:p-9">
        <h3 className="font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-[130%] tracking-[-2%]">
          Welcome Back, John Doe
        </h3>
        <p className="text-xs sm:text-sm lg:text-base leading-[150%] text-gray-2">
          {" "}
          Let&apos;s continue your journey to exam success
        </p>
      </div>
    </section>
  );
}
