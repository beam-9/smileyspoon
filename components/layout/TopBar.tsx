"use client";

//use client for the useState



import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TopBar = () => {
  // only show when not max screen width, use as a dropdown menu
  const [dropdownMenu, setDropdownMenu] = useState(false);
  //for there to be blue colour on hover, and to redirect on click
  const pathName = usePathname();

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-blue-4 shadow-x1 lg:hidden">
      <Image src="/logo.png" alt="logo" width={50} height={50} />

      {/* mapping each sidebar link */}
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            //if pathname == the url then highlight it blue. Use of ` ` for dynamic string so we can include the ternary operator.
            className={`flex gap-4 text-body-medium ${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}
          >
            {/* only want label, no icon as limited space */}
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      
      {/* for dropdown to have absolute pos, parent must be relative */}
      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-x1 rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className="flex gap-4 text-body-medium"
              >
              {link.icon} <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
