"use client";
import TitleCase from "./TitleCase";
import SubtleText from "./SubtleText";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Label({ text }: { text: string }) {
  return (
    <p className="text-black-others leading-[120%] tracking-[-1%] ">{text}</p>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = mode === "register";

  return (
    <section className="mt-4 sm:mt-6 lg:mt-8 px-0 sm:px-4 lg:px-15">
      <div className="authFormBorder rounded-[16px] flex flex-col lg:flex-row justify-between overflow-x-hidden">
        <aside className="hidden -ml-6 lg:block w-1/2 authFormBg"></aside>
        <aside className="w-full lg:w-1/2 flex items-center flex-col gap-8 sm:gap-10 lg:gap-12 justify-center px-4 sm:pr-8 lg:pr-10 py-8 sm:py-10">
          <div>
            <TitleCase text={register ? "Get Started" : "Welcome Back"} />
            <SubtleText
              text={
                register
                  ? "Sign up to start learning"
                  : "Sign in to access your courses"
              }
            />
          </div>

          <div className="w-full space-y-4 sm:space-y-6">
            {/* Form components */}
            <div className="space-y-2 ">
              <Label text="Email" />
              <input
                type="text"
                placeholder="johndoe@gmail.com"
                className="border-[0.5px] rounded-[8px] px-3 sm:px-4 py-2.5 sm:py-3 border-secondary-20 w-full "
              />
            </div>
            <div className="space-y-2">
              <Label text="Password" />
              <input
                type="password"
                placeholder=""
                className="border-[0.5px] rounded-[8px] px-3 sm:px-4 py-2.5 sm:py-3 border-secondary-20 w-full "
              />
            </div>
          </div>

          <div className="w-full text-center flex flex-col items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-[90%] font-bold"
            >
              {register ? "Sign Up" : "Sign In"}
            </Button>
            <Link href={register ? "/login" : "/register"}>
              {register ? (
                <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
                  Already have an account?{" "}
                  <span className="text-primary-100 font-bold">Sign In</span>
                </span>
              ) : (
                <span className="font-light text-sm md:text-base leading-[150%] text-subtle-text">
                  Don&apos;t have an account?
                  <span className="text-primary-100 font-bold"> Sign Up</span>
                </span>
              )}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
