export default function Loading() {
  return (
    <div className="py-6 space-y-8">
      {/* Welcome + stats */}
      <div className="px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="h-8 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[130px] rounded-[12px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="px-4 sm:px-6 lg:px-10 space-y-4">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-24 rounded-[12px] bg-gray-200 animate-pulse" />
      </div>

      {/* My Courses */}
      <div className="px-4 sm:px-6 lg:px-10 space-y-4">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-[16px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
