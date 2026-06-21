import {
  CoursesIllustration,
  QuestionIllustration,
  SubscriptionsIllustration,
} from "./StatIllustrations";

type Stat = {
  label: string;
  value: string;
  suffix?: string;
  caption: string;
  Illustration: (props: { className?: string }) => React.JSX.Element;
};

const stats: Stat[] = [
  {
    label: "Question Bank",
    value: "200",
    suffix: "/800",
    caption: "Cases attempted",
    Illustration: QuestionIllustration,
  },
  {
    label: "Courses",
    value: "4",
    caption: "Enrolled",
    Illustration: CoursesIllustration,
  },
  {
    label: "Subscriptions",
    value: "2",
    caption: "Active",
    Illustration: SubscriptionsIllustration,
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-[12px] adminCardShadow bg-white p-5 min-h-[130px]"
        >
          <stat.Illustration className="absolute right-0 bottom-0 w-24 h-24 pointer-events-none" />
          <div className="relative space-y-1.5">
            <p className="text-subtle-text text-sm leading-[130%]">{stat.label}</p>
            <h3 className="text-black text-3xl sm:text-4xl font-semibold tracking-[-2%] leading-[130%]">
              {stat.value}
              {stat.suffix && (
                <span className="text-subtle-text text-xl font-medium">
                  {stat.suffix}
                </span>
              )}
            </h3>
            <p className="text-subtle-text text-sm leading-[130%]">{stat.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
