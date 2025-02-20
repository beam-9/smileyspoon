import type { Metadata } from "next";
import SideBar from "@/components/layout/SideBar";

import "../globals.css";

// import clerk

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import TopBar from "@/components/layout/TopBar";
import { ToastProvider } from "@/lib/ToastProvider";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });



export const metadata: Metadata = {
  title: "SmileySpoon - Admin",
  description: "Admin dashboard for mr kom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ToastProvider />
          <div className="flex max-lg:flex-col text-grey-1">
            <SideBar />
            <TopBar />
            <div className="flex-1">{children}</div>
          </div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
