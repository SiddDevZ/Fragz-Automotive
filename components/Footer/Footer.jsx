import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white mt-24">
      <div className="max-w-[77rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-800 pb-12">
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
                className="text-gray-300 hover:text-amber-400"
              >
                +44 121 234 5678
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <i className="ri-mail-line text-amber-400"></i>
              <a
                href="mailto:hello@farplates.com"
                className="text-gray-300 hover:text-amber-400"
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
            <div className="grid grid-cols-2 gap-4">
              {[
                "Home",
                "About",
                "Services",
                "FAQ",
                "Contact",
                "Legal Info",
              ].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-amber-400 font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { icon: "ri-instagram-line", link: "#" },
                { icon: "ri-facebook-circle-line", link: "#" },
                { icon: "ri-twitter-x-line", link: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="text-2xl text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} F.A.R Plates. All rights reserved.
            <br />
            DVLA Registered | BS AU 145e Compliant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
