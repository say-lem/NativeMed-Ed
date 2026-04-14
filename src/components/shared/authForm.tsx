"use client";
import TitleCase from "./titleCase";
import SubtleText from "@/app/(public)/_component/SubtleText";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Label({ text }: { text: string }) {
  return (
    <p className="text-blackOthers leading-[120%] tracking-[-1%] ">{text}</p>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = mode === "register";

  return (
    <section className="mt-8 px-15">
      <div className="authFormBorder rounded-[16px] flex justify-center overflow-x-hidden">
        <aside className="w-1/2 h-[70vh] authFormBg"></aside>
        <aside className="w-1/2 flex items-center flex-col gap-12 justify-center px-15">
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

          <div className="w-full space-y-6">
            {/* Form components */}
            <div className="space-y-2 ">
              <Label text="Email" />
              <input
                type="text"
                placeholder="johndoe@gmail.com"
                className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary20 w-full "
              />
            </div>
            <div className="space-y-2">
              <Label text="Password" />
              <input
                type="password"
                placeholder=""
                className="border-[0.5px] rounded-[8px] px-4 py-3 border-secondary20 w-full "
              />
            </div>
          </div>

          <div className="w-full text-center flex flex-col items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-[90%] font-bold"
            >
              {register ? "Sign Up" : "Sign In"}
            </Button>
            <Link href={register ? "/login" : "/register"}>
              {register ? (
                <span className="font-light text-sm md:text-base leading-[150%] text-Subtle-text">
                  Already have an account?{" "}
                  <span className="text-primary100 font-bold">Sign In</span>
                </span>
              ) : (
                <span className="font-light text-sm md:text-base leading-[150%] text-Subtle-text">
                  Don’t have an account?
                  <span className="text-primary100 font-bold"> Sign Up</span>
                </span>
              )}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
