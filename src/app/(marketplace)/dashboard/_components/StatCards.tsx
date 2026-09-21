import axios from "axios";
import {
  CoursesIllustration,
  QuestionIllustration,
  SubscriptionsIllustration,
} from "./StatIllustrations";
import { getMyEnrollments } from "@/services/enrollments.service";
import { getMyLiveCourseEnrollments } from "@/services/liveCourses.service";
import {
  getMySubscriptions,
  getCaseBankStatus,
} from "@/services/subscriptions.service";
import { getSpecialties } from "@/services/cases.service";

/** Regular + live course enrollments combined — the two use separate backend
 *  models (Enrollment refs Course only), so they're fetched and summed here. */
async function loadEnrolledCount(): Promise<number> {
  try {
    const [courses, liveCourses] = await Promise.all([
      getMyEnrollments(),
      getMyLiveCourseEnrollments(),
    ]);
    const courseCount = courses.success
      ? courses.data.filter((e) => e.isActive !== false).length
      : 0;
    const liveCourseCount = liveCourses.success
      ? liveCourses.data.filter((e) => e.isActive !== false).length
      : 0;
    return courseCount + liveCourseCount;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return 0;
  }
}

async function loadActiveSubs(): Promise<number> {
  try {
    const res = await getMySubscriptions();
    return res.success && Array.isArray(res.data) ? res.data.length : 0;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return 0;
  }
}

async function loadCaseBank(): Promise<{ active: boolean; total: number }> {
  try {
    const [status, specialties] = await Promise.all([
      getCaseBankStatus(),
      getSpecialties(),
    ]);
    return {
      active: status.success ? status.data.active : false,
      total: specialties.success
        ? specialties.data.reduce((sum, s) => sum + s.count, 0)
        : 0,
    };
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return { active: false, total: 0 };
  }
}

type Stat = {
  label: string;
  value: string;
  suffix?: string;
  caption: string;
  Illustration: (props: { className?: string }) => React.JSX.Element;
};

export default async function StatCards() {
  const [enrolled, activeSubs, caseBank] = await Promise.all([
    loadEnrolledCount(),
    loadActiveSubs(),
    loadCaseBank(),
  ]);

  const stats: Stat[] = [
    {
      label: "Case Bank",
      value: String(caseBank.total),
      caption: caseBank.active ? "Unlocked" : "Cases available",
      Illustration: QuestionIllustration,
    },
    {
      label: "Courses",
      value: String(enrolled),
      caption: "Enrolled",
      Illustration: CoursesIllustration,
    },
    {
      label: "Subscriptions",
      value: String(activeSubs),
      caption: "Active",
      Illustration: SubscriptionsIllustration,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-[12px] adminCardShadow bg-white p-5 min-h-[130px]"
        >
          <stat.Illustration className="absolute right-0 bottom-0 w-24 h-24 pointer-events-none" />
          <div className="relative space-y-1.5">
            <p className="text-subtle-text text-sm leading-[130%]">
              {stat.label}
            </p>
            <h3 className="text-black text-3xl sm:text-4xl font-semibold tracking-[-2%] leading-[130%]">
              {stat.value}
              {stat.suffix && (
                <span className="text-subtle-text text-xl font-medium">
                  {stat.suffix}
                </span>
              )}
            </h3>
            <p className="text-subtle-text text-sm leading-[130%]">
              {stat.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
