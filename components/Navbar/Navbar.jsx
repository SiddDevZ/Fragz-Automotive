"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";
import categories from "@/app/data";

const NavBar = ({ dark }) => {
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false); // Add loading state for checkout
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const lastScrollY = useRef(0);
  const router = useRouter();

  const navItems = [
    { name: "Home", route: "/" },
    { name: "GET YOUR PLATE", route: "/collections" },
    { name: "Blogs", route: "/blogs" },
    { name: "Reviews", route: "/?scroll=reviews" },
    { name: "Contact", route: "/?scroll=contact" }, // Updated route
  ];

  useEffect(() => {
    const loadCartItems = () => {
      if (typeof window !== "undefined") {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        // Limit cart to maximum 4 items
        const limitedCart = storedCart.slice(0, 4);
        if (limitedCart.length < storedCart.length) {
          localStorage.setItem("cart", JSON.stringify(limitedCart));
        }
        
        setCartItems(limitedCart);

        // Calculate total
        const total = limitedCart.reduce((sum, item) => {
          return sum + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity;
        }, 0);
        setCartTotal(total);
      }
    };

    loadCartItems();

    // Add event listener for storage changes (if cart is updated in another tab)
    window.addEventListener("storage", loadCartItems);
    return () => window.removeEventListener("storage", loadCartItems);
  }, []);

  // Close mobile menu when clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-icon")
      ) {
        setIsMenuOpen(false);
      }

      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        !event.target.closest(".cart-icon")
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalculate total
    const total = updatedCart.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalculate total
    const total = updatedCart.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  // Find product image from categories by slug
  const getProductImage = (categorySlug, productSlug) => {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      const product = category.products.find(p => p.slug === productSlug);
      if (product && product.image) {
        return product.image;
      }
    }
    return null;
  };

  // Proceed to checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckoutLoading) return; // Prevent multiple clicks

    setIsCheckoutLoading(true); // Set loading state
    setIsCartOpen(false); // Close cart sidebar

    // Show a toast notification
    const checkoutToast = document.createElement('div');
    checkoutToast.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-fade-in-up'; // Ensure high z-index
    checkoutToast.innerHTML = `
      <div class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing your checkout...</span>
      </div>
    `;
    document.body.appendChild(checkoutToast);

    try {
      const formData = new FormData();

      // --- Prepare Cart Items ---
      const itemsForJson = [];
      const allFileReferences = {};
      let filesAddedCount = 0;

      cartItems.forEach((item, index) => {
        const { uploadedFiles, ...cleanItem } = item;

        if (!cleanItem.productId) {
          cleanItem.productId = cleanItem.productSlug;
        }
        itemsForJson.push(cleanItem);

        if (uploadedFiles) {
          Object.entries(uploadedFiles).forEach(([key, fileInfo]) => {
            if (fileInfo && fileInfo.cartFileName) {
              const referenceKey = `${item.id || index}-${key}`;
              allFileReferences[referenceKey] = fileInfo.cartFileName;
              filesAddedCount++;
            }
          });
        }
      });

      formData.append('cartItems', JSON.stringify(itemsForJson));

      const firstItem = cartItems[0];
      if (firstItem && firstItem.selectedOptions) {
        Object.keys(firstItem.selectedOptions).forEach(key => {
          formData.append(`options[${key}]`, firstItem.selectedOptions[key]);
        });
      }

      Object.entries(allFileReferences).forEach(([key, cartFileName]) => {
        formData.append(`fileReferences[${key}]`, cartFileName);
      });

      if (firstItem && firstItem.regNo) {
        formData.append('regNo', firstItem.regNo);
      }

      console.log('FormData:', formData);
      // do not let it go after the setTimeout before it completes

      // await new Promise(resolve => setTimeout(resolve, 10000000));

      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        body: formData,
      });

      if (checkoutToast.parentNode) {
        document.body.removeChild(checkoutToast);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout Server Error Response:', errorText);
        throw new Error(`Checkout failed: ${response.status} - ${errorText}`);
      }

      const session = await response.json();

      if (!session.url) {
        throw new Error('Checkout response did not contain a session URL.');
      }

      window.location.href = session.url;

    } catch (error) {
      console.error('Error during checkout:', error);
      if (checkoutToast.parentNode) {
        document.body.removeChild(checkoutToast);
      }
      alert(`Checkout Error: ${error.message}`);
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed z-50 top-0 left-0 right-0 transition-all duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? dark
              ? "backdrop-blur-lg bg-[#f5f5f5]"
              : "backdrop-blur-lg bg-[#5a5a5a71]"
            : ""
        } w-full`}
      >
        <div className="flex max-w-[77rem] mx-auto items-center justify-between pt-6 pb-4 sm:px-16 xs:px-12 xss:px-7">
          <h1
            onClick={() => router.push("/")}
            className={`cursor-pointer text-3xl font-inter font-semibold transition-all duration-300 hover:scale-105 ${
              dark ? "text-[#1d1d1d]" : "text-[#ebebeb]"
            }`}
          >
            F.A.R
          </h1>

          {/* Desktop Navigation Items */}
          <ul className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  onClick={() => router.push(item.route)}
                  className={`cursor-pointer text-sm sm:text-base font-pop transition-colors duration-300 relative group uppercase ${
                    dark
                      ? "text-[#1d1d1d] hover:text-[#333]"
                      : "text-[#dfe2e7] hover:text-[#f5f5f6]"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 right-0 bottom-[-1px] h-[1.3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                      dark ? "bg-[#1d1d1d]" : "bg-[#ebecef]"
                    }`}
                  ></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Icons: Shopping bag + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              className="hover:scale-[1.1] transition-all duration-150 ease-in-out cart-icon relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <i
                className={`ri-shopping-bag-4-line text-3xl ${
                  dark ? "text-[#1d1d1d]" : "text-[#f4f4f4]"
                }`}
              ></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              className="md:hidden hamburger-icon p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i
                className={`ri-${isMenuOpen ? "close" : "menu"}-line text-3xl ${
                  dark ? "text-[#1d1d1d]" : "text-[#f4f4f4]"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden z-[60] ${
          dark ? "bg-white/50" : "bg-black/50"
        } backdrop-blur-sm`}
      >
        <div
          ref={menuRef}
          className={`absolute right-0 top-0 h-full w-4/5 transition-all duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${dark ? "bg-[#f5f5f5]" : "bg-white"} backdrop-blur-lg shadow-2xl`}
        >
          {/* Close Button inside Mobile Menu */}
          <button
            className="absolute right-6 top-6 p-2 hover:scale-110 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <i
              className={`ri-close-line text-3xl ${
                dark ? "text-[#1d1d1d]" : "text-gray-800"
              }`}
            />
          </button>

          <ul className="flex flex-col space-y-6 p-8 mt-20 h-full">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  onClick={() => {
                    router.push(item.route);
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer text-xl font-medium transition-colors duration-300 relative group uppercase ${
                    dark
                      ? "text-[#1d1d1d] hover:text-[#333]"
                      : "text-gray-800 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 right-0 bottom-[-1px] h-[1.3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                      dark ? "bg-[#1d1d1d]" : "bg-gray-800"
                    }`}
                  ></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } z-[70] bg-black/30 backdrop-blur-sm`}
      >
        <div
          ref={cartRef}
          className={`absolute right-0 top-0 h-full w-full sm:w-[450px] transition-all duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          } bg-white shadow-2xl flex flex-col`}
        >
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Your Cart</h2>
            <button
              className="p-2 hover:scale-110 transition-transform"
              onClick={() => setIsCartOpen(false)}
            >
              <i className="ri-close-line text-2xl text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/collections");
                  }}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-6">
                {cartItems.length > 4 && (
                  <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-700 mb-4">
                    <p>Maximum 4 items allowed in cart. Some items may have been removed.</p>
                  </div>
                )}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex border-b border-gray-100 pb-4"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4 relative">
                      {item.categorySlug && item.productSlug ? (
                        <div className="relative w-full h-full">
                          {getProductImage(item.categorySlug, item.productSlug) ? (
                            <Image 
                              src={getProductImage(item.categorySlug, item.productSlug)}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                              <i className="ri-car-line text-2xl"></i>
                            </div>
                          )}
                          <div className="w-full h-full hidden items-center justify-center bg-gray-200 text-gray-600">
                            <i className="ri-car-line text-2xl"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                          <i className="ri-car-line text-2xl"></i>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-medium">
                        {item.productName}
                      </h3>
                      <p className="text-gray-500 text-sm">Reg: {item.regNo}</p>
                      {item.selectedOptions &&
                        Object.keys(item.selectedOptions).length > 0 && (
                          <div className="mt-1">
                            {Object.entries(item.selectedOptions).map(
                              ([name, value], index) => (
                                <p
                                  key={index}
                                  className="text-gray-500 text-xs"
                                >
                                  {name}: {value}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded">
                          <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-2 py-1">{item.quantity}</span>
                          <button
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price and Remove Button Column */}
                    <div className="h-full flex flex-col justify-between items-end ml-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 mb-4 p-1"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                      <span className="font-medium text-gray-800">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">
                  £
                  {cartItems
                    .reduce((total, item) => {
                      // Extract numeric value from price string (removing £ symbol)
                      const price =
                        parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
                      return total + price * item.quantity;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>

              {/* Shipping note */}
              <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">
                Shipping calculated at checkout
              </p>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading} // Disable button when loading
                className={`w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center ${isCheckoutLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isCheckoutLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout <i className="ri-arrow-right-line ml-2"></i>
                  </>
                )}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm flex items-center justify-center transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i> Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
