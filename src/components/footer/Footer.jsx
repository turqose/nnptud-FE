import { Facebook, Instagram, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Product", href: "/product" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
  ],
  social: [
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#141718]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-20 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="text-2xl font-semibold text-white">
              3legant.
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              Gift & Decoration Store
            </p>
          </div>

          {/* Navigation */}
          <nav className="-mb-6 flex flex-wrap justify-center gap-x-8 gap-y-4 sm:justify-end">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm leading-6 text-gray-300 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10 pt-8 sm:mt-16">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright and Legal */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <p className="text-sm leading-5 text-gray-400">
                Copyright © 2023 3legant. All rights reserved
              </p>
              <nav className="flex gap-6">
                {navigation.legal.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm leading-5 text-gray-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
