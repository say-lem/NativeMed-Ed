import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Admin-uploaded schedule/table-of-contents PDF — shown at the end of a course
 *  detail page to everyone, including unauthenticated visitors. `url` is a
 *  freshly-signed Cloudinary link; never cache or persist it. */
export default function CourseSchedule({ url }: { url: string }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="font-semibold text-xl sm:text-2xl text-black-others">
        Course Schedule
      </h2>
      <Button asChild className="font-bold text-sm sm:text-base bg-black-others">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <FileText size={16} />
          View / Download Course Schedule
        </a>
      </Button>
    </div>
  );
}
