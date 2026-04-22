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
import { LogOutIcon } from "lucide-react";

export default function SideNav() {
  const pathName = usePathname();

  return (
    <div>
      <aside className="flex gap-1 items-center px-5">
        <Image
          src={"/Images/nativeMedLogo.png"}
          alt="NativeMed Logo"
          width={45}
          height={45}
        />

        <p className="font-semibold leading-[150%] text-black-others mt-5">
          Native Medical Education
        </p>
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
            <MockIcon
              color={pathName === "/mockicon" ? "#5925B3" : "#373737"}
            />
          }
          href="/mock"
          label="Mock"
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
