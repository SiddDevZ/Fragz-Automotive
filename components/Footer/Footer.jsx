import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white mt-24">
      <div className="max-w-[77rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-800 pb-8 md:pb-12">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-amber-400 font-bold text-lg mb-4">
              F.A.R Plates
            </h3>
            <div className="flex items-start space-x-3">
              <i className="ri-map-pin-line text-amber-400 mt-1"></i>
              <p className="text-gray-300">
                123 Automotive Way
                <br />
                Birmingham, B1 1AB
                <br />
                United Kingdom
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <i className="ri-phone-line text-amber-400"></i>
              <a
                href="tel:+441212345678"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                +44 121 234 5678
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <i className="ri-mail-line text-amber-400"></i>
              <a
                href="mailto:hello@farplates.com"
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                hello@farplates.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-amber-400 font-bold text-lg mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Collections", path: "/collections" },
                { name: "Blogs", path: "/blogs" },
                { name: "Contact", path: "/?scroll=contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-gray-300 hover:text-amber-400 transition-colors py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { icon: "ri-instagram-line", link: "https://instagram.com" },
                { icon: "ri-facebook-circle-line", link: "https://facebook.com" },
                { icon: "ri-twitter-x-line", link: "https://x.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-300 hover:text-amber-400 transition-colors"
                  aria-label={`Follow us on ${social.icon.split('-')[1].replace('-line', '')}`}
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 md:pt-8 text-center sm:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} F.A.R Plates. All rights reserved.
            <br className="sm:hidden" /> <span className="hidden sm:inline">|</span> DVLA Registered | BS AU 145e Compliant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
