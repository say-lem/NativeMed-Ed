"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSideNavLink from "./AdminSideNavLink";
import { CalendarClock, CalendarDays, GraduationCap, Home, Radio, Star, Users as UsersIcon } from "lucide-react";
import {
  CoursesIcon,
  DashboardIcon,
  QuestionBankIcon,
  SettingsIcon,
  SubscriptionsIcon,
  LogoutIcon,
} from "@/app/(marketplace)/_components/Icons";

const ACTIVE = "#5925B3";
const INACTIVE = "#373737";

export default function AdminSideNav() {
  const pathName = usePathname();
  const color = (href: string) =>
    pathName.startsWith(href) ? ACTIVE : INACTIVE;

  return (
    <div>
      <aside className="flex items-center px-5 justify-center">
        <Link href="/">
          <Image
            src={"/Images/main_logo.png"}
            alt="Native Medical Education"
            width={100}
            height={100}
            className="w-20 lg:w-28 mix-blend-multiply"
          />
        </Link>
      </aside>

      <aside className="pt-7">
        <AdminSideNavLink
          icon={<DashboardIcon color={color("/admin-dashboard")} />}
          href="/admin-dashboard"
          label="Dashboard"
        />
        <AdminSideNavLink
          icon={<Home size={22} color={color("/admin-homepage")} />}
          href="/admin-homepage"
          label="Homepage"
        />
        <AdminSideNavLink
          icon={<SubscriptionsIcon color={color("/admin-subscribers")} />}
          href="/admin-subscribers"
          label="Subscribers"
        />
        <AdminSideNavLink
          icon={<UsersIcon size={22} color={color("/admin-users")} />}
          href="/admin-users"
          label="Users"
        />

        <AdminSideNavLink
          icon={<GraduationCap size={22} color={color("/admin-enrollments")} />}
          href="/admin-enrollments"
          label="Enrollments"
        />
        <AdminSideNavLink
          icon={<QuestionBankIcon color={color("/admin-casebank")} />}
          href="/admin-casebank"
          label="Casebank"
        />
        <AdminSideNavLink
          icon={<CoursesIcon color={color("/admin-courses")} />}
          href="/admin-courses"
          label="Courses"
        />
        <AdminSideNavLink
          icon={<Radio size={22} color={color("/admin-live-courses")} />}
          href="/admin-live-courses"
          label="Live Courses"
        />
        <AdminSideNavLink
          icon={<Star size={22} color={color("/admin-reviews")} />}
          href="/admin-reviews"
          label="Reviews"
        />
        <AdminSideNavLink
          icon={<CalendarDays size={22} color={color("/admin-events")} />}
          href="/admin-events"
          label="Events"
        />
        <AdminSideNavLink
          icon={<CalendarClock size={22} color={color("/admin-booking")} />}
          href="/admin-booking"
          label="1-on-1 Bookings"
        />

        <AdminSideNavLink
          icon={<SettingsIcon color={color("/admin-settings")} />}
          href="/admin-settings"
          label="Settings"
        />
        <AdminSideNavLink
          icon={<LogoutIcon color={INACTIVE} />}
          href="/logout"
          label="Log Out"
        />
      </aside>
    </div>
  );
}
