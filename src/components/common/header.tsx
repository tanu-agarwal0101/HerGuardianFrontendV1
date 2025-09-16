"use client";
import { CheckCircle, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import Dashboard from "./../../app/dashboard/page";
import { useState } from "react";
import { set } from "zod";
import MobileDrawer from "./mobileDrawer";
import { Badge } from "@/components/ui/badge";
import { LogoutDialog } from "./logout";

export default function Header() {
  const router = useRouter();
  const [smallMenuOpen, setSmallMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  return (
    <header className="bg-purple-500 text-white h-15 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="flex">
          <ShieldCheck />
          HerGuardian
        </h1>
        <span className="bg-green-200/90 text-green-700 p-1 w-fit h-fit flex">
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
          handleLogout={() => {}}
        />
      )}
    </header>
  );
}
