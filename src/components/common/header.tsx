"use client";
import { Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from "next/navigation";
import Dashboard from './../../app/dashboard/page';
import { useState } from "react";
import { set } from "zod";
import MobileDrawer from "./mobileDrawer";

export default function Header() {
  const router = useRouter();
  const [smallMenuOpen, setSmallMenuOpen] = useState(false);
  const handleLogout = async()=>{
    try {
      const res = await axios.post("http://localhost:5001/users/logout", {}, {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("Logout successful");
        router.push("/")
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <header className="bg-purple-500 text-white h-15 p-4 flex items-center justify-between">
      <h1 className="flex">
        <ShieldCheck />
        HerGuardian
      </h1>
      <nav className="space-x-4 flex-wrap hidden lg:flex md:flex items-center justify-center">
        <Link href="/" className="text-white hover:text-purple-200">
          Home
        </Link>
        <Link href="/dashboard" className="text-white hover:text-purple-200">
          Dashboard
        </Link>
        <Link href="/about" className="text-white hover:text-purple-200">
          About Us
        </Link>
        <Link href="/contact" className="text-white hover:text-purple-200">
          Contact
        </Link>
        <Button variant="outline" className="text-black" onClick = {()=> handleLogout()}>
          Logout
        </Button>
      </nav>
      <Button className="lg:hidden md:hidden bg-transparent hover:bg-transparent" onClick={() => setSmallMenuOpen(!smallMenuOpen)}>
        {smallMenuOpen ? <X/> : <Menu/>}
      </Button>

        {smallMenuOpen && (
          <MobileDrawer setSmallMenuOpen={setSmallMenuOpen} 
          onCloseMenu={() => setSmallMenuOpen(false)}
          isOpen={smallMenuOpen}
          />
        )}
    </header>
  );
}
