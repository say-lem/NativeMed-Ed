"use client";
import Image from "next/image";
import SideNavLink from "./SideNavLinks";
import {
  CoursesIcon,
  DashboardIcon,
  MockIcon,
  SettingsIcon,
  SubscriptionsIcon,
} from "./Icons";
import { usePathname } from "next/navigation";
import { CalendarClock, GraduationCap, LogOutIcon } from "lucide-react";

export default function SideNav() {
  const pathName = usePathname();

  return (
    <div>
      <aside className="flex items-center px-5 justify-center">
        {/* <Image
          src={"/Images/nativeMedLogo.png"}
          alt="NativeMed Logo"
          width={45}
          height={45}
        /> */}

        {/* <p className="font-semibold leading-[150%] text-black-others mt-5">
          Native Medical Education
        </p> */}
        <Image
          src={"/Images/main_logo.png"}
          alt="NativeMed Logo"
          width={100}
          height={100}
          className="w-20 lg:w-28 mix-blend-multiply"
        />
      </aside>

      <aside className="pt-7">
        <SideNavLink
          icon={
            <DashboardIcon
              color={pathName === "/dashboard" ? "#5925B3" : "#373737"}
            />
          }
          href="/dashboard"
          label="Dashboard"
        />

        <SideNavLink
          icon={
            <CoursesIcon
              color={pathName === "/courses" ? "#5925B3" : "#373737"}
            />
          }
          href="/courses"
          label="Courses"
        />
        <SideNavLink
          icon={
            <GraduationCap
              size={20}
              color={pathName === "/my-courses" ? "#5925B3" : "#373737"}
            />
          }
          href="/my-courses"
          label="My Courses"
        />
        <SideNavLink
          icon={
            <MockIcon
              color={pathName === "/full-cases" ? "#5925B3" : "#373737"}
            />
          }
          href="/full-cases"
          label="Case Bank"
        />

        <SideNavLink
          icon={
            <CalendarClock
              size={20}
              color={pathName === "/one-on-one" ? "#5925B3" : "#373737"}
            />
          }
          href="/one-on-one"
          label="1-on-1 Sessions"
        />
        <SideNavLink
          icon={
            <SubscriptionsIcon
              color={pathName === "/subscriptions" ? "#5925B3" : "#373737"}
            />
          }
          href="/subscriptions"
          label="Subscriptions"
        />
        <SideNavLink
          icon={
            <SettingsIcon
              color={pathName === "/settings" ? "#5925B3" : "#373737"}
            />
          }
          href="/settings"
          label="Settings"
        />
        <SideNavLink
          icon={
            <LogOutIcon
              color={pathName === "/logout" ? "#5925B3" : "#373737"}
            />
          }
          href="/logout"
          label="Log Out"
        />
      </aside>
    </div>
  );
}
