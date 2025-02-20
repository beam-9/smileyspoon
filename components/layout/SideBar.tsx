"use client";

import { navLinks } from "@/lib/constants";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = () => {
  const pathName = usePathname();

  return (
    //sticky so it remains fixed within parent container, the side bar is only shown for max screen size, otherwise top bar
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-4 max-lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={50} />

      {/* mapping each sidebar link */}
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium'${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-body-medium item-center">
        <UserButton />
        <p>Edit Profile</p>
      </div>
    </div>
  );
};

export default SideBar;
