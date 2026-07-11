import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-white">
      <div className="max-w-md text-center space-y-5">
        <p className="text-6xl sm:text-7xl font-black text-[#2D135C] leading-none">
          404
        </p>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold text-black-others">
            Page not found
          </h1>
          <p className="text-subtle-text leading-[150%]">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#2D135C] text-white text-sm font-medium px-6 py-3 hover:opacity-90"
          >
            <Home size={16} />
            Go to homepage
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#2D135C] text-[#2D135C] text-sm font-medium px-6 py-3 hover:bg-primary-10"
          >
            <Compass size={16} />
            My dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
