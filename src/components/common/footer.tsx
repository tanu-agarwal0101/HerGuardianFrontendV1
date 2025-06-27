"use client";
import Link from "next/link";
import React from "react";

// const Footer: React.FC = () => {
//   return (

//   );
// };

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 p-4 text-center">
      <div className="flex flex-wrap lg:px-20 px-4 py-10 justify-between items-start ">
        <div className="grid text-left p-2">
          <h1 className="font-extrabold text-white">HerGuardian</h1>
          <p className="w-80">
            Your silent shield, your digital guardian. Empowering women through
            technology.
          </p>
          <p>icons</p>
        </div>
        <div className="text-left p-2">
          <h1 className="font-extrabold text-white">Quick Links</h1>
          <ul className="list-none leading-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/">Features</Link>
            </li>
            <li>
              <Link href="/">How It Works</Link>
            </li>
            <li>
              <Link href="/">Testimonials</Link>
            </li>
            <li>
              <Link href="/">About Us</Link>
            </li>
          </ul>
        </div>
        <div className="text-left p-2">
          <h1 className="font-extrabold text-white">Legal</h1>
          <ul className="list-none leading-6">
            <li>
              <Link href="/">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/">Terms of Service</Link>
            </li>
            <li>
              <Link href="/">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/">GDPR Compliance</Link>
            </li>
          </ul>
        </div>
        <div className="text-left p-2">
          <h1 className="font-extrabold text-white">Contact</h1>
          <ul className="list-none leading-6">
            <li>support@herguardian.com</li>
            <li>+1 (800) 555-0123</li>
            <li>How It Works</li>
            <li>San Francisco, CA</li>
            <li>We&apos;re here for you 24/7</li>
          </ul>
        </div>
      </div>
      {/* <Separator className='text-white bg-white'/> */}
      <hr className="mb-4" />
      <p>
        &copy; {new Date().getFullYear()} Her Guardian. All rights reserved.
      </p>
      <p>Built with love for safety</p>
    </footer>
  );
};
export default Footer;
