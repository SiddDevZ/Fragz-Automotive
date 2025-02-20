'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import 'remixicon/fonts/remixicon.css';

const NavBar = ({ dark }) => {
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const lastScrollY = useRef(0);
  const router = useRouter();

  const navItems = [
    { name: "Home", route: "/" },
    { name: "GET YOUR PLATE", route: "/collections" },
    { name: "Blogs", route: "/blogs" },
    { name: "Reviews", route: "/?scroll=reviews" },
    { name: "Contact", route: "/contact" },
  ];

  // Close mobile menu when clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('.hamburger-icon')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show/hide navbar on scroll and add a backdrop blur if scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) setShow(false);
      else setShow(true);
      lastScrollY.current = window.scrollY;
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed z-50 top-0 left-0 right-0 transition-all duration-300 ${
          show ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled ? (dark ? 'backdrop-blur-lg bg-[#f5f5f5]' : 'backdrop-blur-lg bg-[#5a5a5a71]') : ''} w-full`}
      >
        <div className="flex max-w-[77rem] mx-auto items-center justify-between pt-6 pb-4 sm:px-16 xs:px-12 xss:px-7">
          <h1 className={`text-3xl font-inter font-semibold transition-all duration-300 hover:scale-105 ${dark ? 'text-[#1d1d1d]' : 'text-[#ebebeb]'}`}>
            F.A.R
          </h1>

          {/* Desktop Navigation Items */}
          <ul className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  onClick={() => router.push(item.route)}
                  className={`cursor-pointer text-sm sm:text-base font-pop transition-colors duration-300 relative group uppercase ${dark ? 'text-[#1d1d1d] hover:text-[#333]' : 'text-[#dfe2e7] hover:text-[#f5f5f6]'}`}
                >
                  {item.name}
                  <span className={`absolute left-0 right-0 bottom-[-1px] h-[1.3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${dark ? 'bg-[#1d1d1d]' : 'bg-[#ebecef]'}`}></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Icons: Shopping bag + Hamburger */}
          <div className="flex items-center gap-4">
            <button className="hover:scale-[1.1] transition-all duration-150 ease-in-out">
              <i className={`ri-shopping-bag-4-line text-3xl ${dark ? 'text-[#1d1d1d]' : 'text-[#f4f4f4]'}`}></i>
            </button>

            <button
              className="md:hidden hamburger-icon p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-3xl ${dark ? 'text-[#1d1d1d]' : 'text-[#f4f4f4]'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:hidden z-[60] ${dark ? 'bg-white/50' : 'bg-black/50'} backdrop-blur-sm`}
      >
        <div
          ref={menuRef}
          className={`absolute right-0 top-0 h-full w-4/5 transition-all duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } ${dark ? 'bg-[#f5f5f5]' : 'bg-white'} backdrop-blur-lg shadow-2xl`}
        >
          {/* Close Button inside Mobile Menu */}
          <button
            className="absolute right-6 top-6 p-2 hover:scale-110 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className={`ri-close-line text-3xl ${dark ? 'text-[#1d1d1d]' : 'text-gray-800'}`} />
          </button>

          <ul className="flex flex-col space-y-6 p-8 mt-20 h-full">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  onClick={() => {
                    router.push(item.route);
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer text-xl font-medium transition-colors duration-300 relative group uppercase ${dark ? 'text-[#1d1d1d] hover:text-[#333]' : 'text-gray-800 hover:text-gray-900'}`}
                >
                  {item.name}
                  <span className={`absolute left-0 right-0 bottom-[-1px] h-[1.3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${dark ? 'bg-[#1d1d1d]' : 'bg-gray-800'}`}></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;