"use client";
import Link from "next/link";
import React from "react";
import { Shield, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 bg-background/40 backdrop-blur-xl overflow-hidden pt-16 pb-8">
    
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
            
        
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
                <div className="rounded-full  p-2 group-hover:bg-primary/20 transition-colors">
                    <img src="/image.png" alt="HerGuardian Logo" className="w-8 h-8 rounded-lg" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">HerGuardian</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Your silent shield, your digital guardian. Empowering women through technology and building a safer world for everyone.
            </p>
            {/* <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                    <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                    <Linkedin className="w-4 h-4" />
                </a>
            </div> */}
          </div>

          
          <div className="lg:col-span-3 lg:col-start-6 space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/registration" className="text-sm text-muted-foreground hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> support@herguardian.com
              </li>
              <li className="text-sm text-muted-foreground">We&apos;re here for you 24/7</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HerGuardian. All rights reserved.
          </p>
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Built with <span className="text-primary">♥</span> for safety
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
