"use client";
import { CheckCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileDrawer from "./mobileDrawer";
import { LogoutDialog } from "./logout";

export default function Header() {
  const [smallMenuOpen, setSmallMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  return (
    <header className="bg-[#6366f1] text-white h-15 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="flex">
          <Image src="/image.png" alt="HerGuardian Logo" width={32} height={32} className="w-8 h-8 rounded-lg mr-2" />
          HerGuardian
        </h1>
        <span className="bg-green-300/90 p-1 rounded-lg text-green-700 w-fit h-fit flex">
          <CheckCircle className="text-green-700" />
          You&apos;re Safe
        </span>
      </div>
      <nav className="space-x-4 flex-wrap hidden lg:flex md:flex items-center justify-center">
        <Link href="/" className="text-white hover:text-purple-200">
          Home
        </Link>
        <Link href="/dashboard" className="text-white hover:text-purple-200">
          Dashboard
        </Link>
        <Link href="/test" className="text-white hover:text-purple-200">
          About Us
        </Link>
        <Link href="/profile" className="text-white hover:text-purple-200">
          Profile
        </Link>
        <Button
          variant="outline"
          className="text-black"
          onClick={() => setShowLogoutDialog(true)}
        >
          Logout
        </Button>
        {showLogoutDialog && (
          <LogoutDialog open={showLogoutDialog} setOpen={setShowLogoutDialog} />
        )}
      </nav>
      <Button
        className="lg:hidden md:hidden bg-transparent hover:bg-transparent"
        onClick={() => setSmallMenuOpen(!smallMenuOpen)}
      >
        {smallMenuOpen ? <X /> : <Menu />}
      </Button>

      {smallMenuOpen && (
        <MobileDrawer
          setSmallMenuOpen={setSmallMenuOpen}
          onCloseMenu={() => setSmallMenuOpen(false)}
          isOpen={smallMenuOpen}
          handleLogout={() => setShowLogoutDialog(true)}
        />
      )}
    </header>
  );
}
