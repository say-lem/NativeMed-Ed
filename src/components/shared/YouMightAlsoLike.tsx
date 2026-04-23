import Image from "next/image";
import TitleCase from "./TitleCase";
import { Button } from "../ui/button";

const courses = [
  {
    id: 1,
    title: "1-on-1 Sessions with Dr Native (12 Cases)",
    description:
      "Elevate your exam preparation with personalized, one-on-one coaching by Dr Native. In this focused 1-on-1 session, we’ll go through twelve carefully selected cases",
    price: "560.00",
    tag: "session",
    image: "/Images/coursesImage.png",
  },
  {
    id: 2,
    title: "1-on-1 Sessions with Dr Native (12 Cases)",
    description:
      "Elevate your exam preparation with personalized, one-on-one coaching by Dr Native. In this focused 1-on-1 session, we’ll go through twelve carefully selected cases",
    price: "560.00",
    tag: "session",
    image: "/Images/side-view-nurses-studying-together 2.png",
  },
];

const courseCard = courses.map((course) => (
  <div
    key={course.id}
    className="rounded-[16px] p-1 bg-[#FFFFFF] alsoLikeBorder flex flex-col md:flex-row  gap-6"
  >
    <aside className="relative w-full md:basis-1/4 min-h-40 sm:min-h-48 lg:min-h-64 ">
      <Image
        src={course.image}
        alt={`image of ${course.title}`}
        fill
        className="object-cover object-center rounded-[8px]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <p className="absolute rounded-[100px] py-2 px-3 top-2 right-5 bg-[#00000080] border-[0.2px] border-white/0.8 text-xs font-semibold text-primary-white leading-[150%] tracking-[-1%]">
        {course.tag}
      </p>
    </aside>

    <aside className="w-full md:basis-3/4 flex flex-col gap-4 py-4 px-6 justify-between sm:gap-6">
      <h3 className="font-semibold text-lg sm:text-xl leading-[130%] tracking-[-2%] text-black-others">
        {course.title}
      </h3>
      <p className="font-light text-sm sm:text-base leading-[150%] text-[#373737]">
        {course.description}
      </p>

      <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-4 items-stretch">
        <h4 className="font-semibold text-lg sm:text-xl leading-[130%] tracking-[-2%] text-black-others self-center">
          £{Number(course.price).toFixed(2)}
          <span className="text-base leading-[120%] ">/month</span>
        </h4>
        <Button className="font-bold text-sm bg-black-others">Buy Now</Button>
      </div>
    </aside>
  </div>
));

export default function YouMightAlsoLike() {
  return (
    <section className="py-12 px-8 space-y-4">
      <TitleCase text="You Might Also Like" />

      <div className="space-y-4">{courseCard}</div>
    </section>
  );
}
