"use client";
import Navbar from "../components/Navbar/Navbar";
import Featured from "../components/Featured/Featured";
import Reviews from "../components/Reviews/Reviews";
import { useSearchParams } from "next/navigation";
import { useRef, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../components/Footer/Footer";

function SearchParamsHandler({ onReviewsScroll, onContactScroll }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget === "reviews") {
      setTimeout(onReviewsScroll, 100);
    } else if (scrollTarget === "contact") {
      setTimeout(onContactScroll, 100);
    }
  }, [searchParams, onReviewsScroll, onContactScroll]);

  return null;
}

export default function Home() {
  const router = useRouter();
  const reviewsRef = useRef(null);
  const contactRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToreviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    window.history.pushState({}, "", "/");
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    window.history.pushState({}, "", "/");
  };

  const goToCollections = () => {
    router.push("/collections");
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#ffffff] relative">
        <Navbar />

        <Suspense fallback={null}>
          <SearchParamsHandler
            onReviewsScroll={scrollToreviews}
            onContactScroll={scrollToContact}
          />
        </Suspense>

        {/* Hero Section */}
        <div className="relative h-[90vh] overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1617286114183-3de6d981bcd7"
              alt="Premium Number Plates"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative animate-in z-10 mt-14 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl transform transition-all duration-500">
              {/* Trustpilot Badge */}

              {/* Main Heading */}
              <h1 className="text-[1.9rem] leading-9 xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold font-inter text-white tracking-tight">
                Premium Number Plates <br />
                <span className="text-amber-400"> Crafted to Perfection</span>
              </h1>

              {/* Subtext */}
              <p className="text-[0.85rem] sm:leading-6 mt-2.5 sm:mt-4 mb-6 sm:text-xl text-white/90 max-w-2xl mx-auto ">
                Elevate your vehicle's identity with our bespoke number plates.
                Durable materials, legal compliance, and instant
                personalization.
              </p>

              {/* CTA Buttons */}
              <div className="space-x-2 xs:space-x-3 sm:space-x-4 md:mt-6 sm:mt-5 xss:mt-3">
                <button
                  onClick={() => goToCollections()}
                  className="px-[4.3vw] py-[1.9vw] xss:py-[0.65rem] xss:px-[1.65rem] xs:px-[4.3vw] xs:py-[1.6vw] sm:px-[2.1rem] sm:py-[0.7rem] md:px-[2.6rem] md:py-[0.75rem] lg:px-[2.25rem] lg:py-[0.65rem] bg-[#bd981d] transition-all hover:scale-[1.03] hover:bg-[#c8a01d] text-white text-[3.8vw] xs:text-[3vw] sm:text-[1rem] md:text-[1.2rem] font-pop font-medium rounded-full"
                >
                  Design Your Plate
                </button>
              </div>

              <div className="flex items-center cursor-pointer mt-10 justify-center space-x-5 hover:scale-[1.03] transition-transform ease-in duration-300">
                <div className="flex flex-col items-center">
                  <img
                    src="https://www.pngtank.com/storage/thumbnails/ZcODYq3VtpRFOtQO7cooP65qWb8c0QnkXDPYnDog.png"
                    alt="Trustpilot"
                    className="h-7 w-auto xs:h-9 sm:h-10"
                  />
                  <span className="text-yellow-400 text-lg xs:text-xl sm:text-2xl -translate-y-1 self-end">
                    ★★★★★
                  </span>
                </div>
                <div className="text-white flex items-center space-x-1">
                  <span className="text-sm xs:text-base sm:text-lg font-pop">
                    4.9/5 from 1,200+ reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="about mt-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center space-y-10 lg:space-y-0 lg:space-x-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full hover:scale-[1.02] transition-all ease-in-out duration-500 lg:w-1/2 relative flex justify-center items-center">
            <div className="w-full h-64 lg:h-96 bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://i.imgur.com/7ElgZ4Y.png"
                alt="About Us"
                className="w-full h-full object-cover object-center opacity-95"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="w-5 h-1 bg-black mr-2"></div>
              <div className="font-inter text-sm text-black">About Us</div>
            </div>
            <h2 className="font-inter tracking-wide text-4xl sm:text-5xl text-black mb-4 leading-tight">
              Excellence in Number Plate Crafting
            </h2>
            <p className="text-base sm:text-lg font-inter text-gray-700 mb-6">
              At Fragz Automotive, we specialize in creating bespoke number
              plates that enhance your vehicle's identity. Our plates are
              crafted from premium materials, ensuring durability and compliance
              with all legal standards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Premium Quality Materials",
                "100% Road Legal",
                "1 Year Warranty",
                "First-Class Customer Service",
                "Customizable Designs",
                "Fast and Reliable Delivery",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center lg:justify-start"
                >
                  <img src="star.svg" alt="" className="w-4 h-4 mr-2" />
                  <span className="text-black font-inter">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => goToCollections()}
              className="bg-[#000000] mt-8 text-white font-bold py-3 px-6 rounded-full hover:bg-[#37321f] hover:shadow-lg hover:scale-105 transition ease-out duration-300"
            >
              DISCOVER OUR RANGE
              <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
        </section>

        {/* <Featured /> */}

        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#fcfcfc] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd52c] to-[#f6a400]">
                  F.A.R Plates
                </span>
                ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover why thousands of drivers trust us for their vehicle
                identity needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "shield-check",
                  color: "bg-blue-100",
                  title: "DVLA-Approved",
                  text: "Full compliance with BS AU 145e standards",
                  stats: "100% Legal",
                },
                {
                  icon: "rocket-2",
                  color: "bg-purple-100",
                  title: "Lightning Fast",
                  text: "Same-day dispatch for orders before 2pm",
                  stats: "4h Avg. Processing",
                },
                {
                  icon: "palette",
                  color: "bg-orange-100",
                  title: "Creative Freedom",
                  text: "50+ unique designs including 4D & carbon fiber",
                  stats: "25 Styles",
                },
                {
                  icon: "medal",
                  color: "bg-green-100",
                  title: "Proven Excellence",
                  text: "Rated 4.9/5 across 2k+ reviews based on Trustpilot",
                  stats: "10Y Warranty",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white cursor-default rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`${feature.color} w-16 h-16 rounded-2xl mb-6 flex items-center justify-center`}
                  >
                    <i
                      className={`ri-${
                        feature.icon
                      }-fill text-3xl text-${feature.color
                        .replace("bg-", "")
                        .replace("-100", "-600")}`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.text}</p>

                  <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-gray-500">
                      {feature.stats}
                    </span>
                  </div>

                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#f6a40030] transition-all duration-300 pointer-events-none" />
                </div>
              ))}
            </div>

            <div className="mt-16 border border-[#f6a400d5] rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "15+", label: "Legal Designs" },
                  { number: "24/7", label: "UK Support" },
                  { number: "4.9★", label: "Customer Rating" },
                  { number: "98%", label: "Same-Day Dispatch" },
                ].map((stat, index) => (
                  <div key={index} className="text-[#cc8800fe]">
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={reviewsRef}
          className="flex flex-col w-[100%] max-w-[77rem] mx-auto mt-[3.5rem] relative"
        >
          <h2 className="text-center font-inter font-medium text-[#090909] sm:text-5xl xs:text-4xl xss:text-4xl leading-10 relative xs:w-full xss:w-[97%] z-10">
            UK's favourite number plate brand
          </h2>
          <h4 className="text-center font-inter font-medium text-[#393939] sm:text-base xss:text-sm sm:w-[60%] mt-3 xss:w-[90%] mx-auto relative z-10">
            Transform your vehicle's look with our premium number plates.
          </h4>
          <Reviews />
        </section>

        <section className="py-16 mt-5 px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-[77rem] mx-auto bg-[#fdfdfd] border rounded-2xl p-8 md:p-16 hover:shadow-sm transition-shadow duration-300"
            style={{
              background:
                "radial-gradient(circle, #D6D5D5 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              padding: "20px",
            }}
          >
            <div className="text-center space-y-8 py-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Vehicle?
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700 mt-2.5 block">
                  We'll Take You F.A.R
                </span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => goToCollections()}
                  className="bg-amber-500 hover:bg-[#ffa50a] text-white px-6 py-3.5 rounded-full font-bold transition-all transform hover:scale-[1.025] ease-in-out shadow-md"
                >
                  Design Your Plate Now
                  <i className="ri-arrow-right-line ml-2 animate-pulse" />
                </button>

                <p className="text-gray-600 sm:ml-4 mt-2 sm:mt-0">
                  or browse our
                  <a
                    onClick={() => goToCollections()}
                    className="text-amber-600 cursor-pointer hover:text-amber-700 font-semibold ml-2"
                  >
                    150+ premium designs →
                  </a>
                </p>
              </div>

              <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-4 rounded-xl">
                  <i className="ri-medal-line text-3xl text-amber-600 mb-2" />
                  <span className="font-semibold">DVLA Approved</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl">
                  <i className="ri-truck-line text-3xl text-amber-600 mb-2" />
                  <span className="font-semibold">Same-Day Dispatch</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl">
                  <i className="ri-shield-check-line text-3xl text-amber-600 mb-2" />
                  <span className="font-semibold">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl">
                  <i className="ri-star-smile-line text-3xl text-amber-600 mb-2" />
                  <span className="font-semibold">4.9/5 Reviews</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-8">
                Trusted by 15,000+ drivers across the UK • 24/7 Customer Support
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactRef}
          className="py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-8 md:p-10">
              <h2 className="text-3xl font-bold text-[#090909] mb-8">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-gray-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-lg font-medium text-gray-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-lg font-medium text-gray-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Type your message here..."
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Details & Map */}
            <div className="flex flex-col gap-10">
              {/* Contact Information */}
              <div className="bg-white px-8 py-6 md:px-10 md:py-7 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-[#090909] mb-4">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <i className="ri-phone-line text-2xl text-amber-500"></i>
                    <p className="sm:text-xl text-gray-700">+44 123 456 7890</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <i className="ri-mail-line text-2xl text-amber-500"></i>
                    <p className="sm:text-xl text-gray-700">
                      support@fragzauto.com
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <i className="ri-map-pin-line text-2xl text-amber-500"></i>
                    <p className="sm:text-xl text-gray-700">
                      123 Automotive Ave, London, UK
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-7">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gray-500 hover:text-amber-500 transition duration-200"
                  >
                    <i className="ri-facebook-circle-line text-3xl"></i>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-gray-500 hover:text-amber-500 transition duration-200"
                  >
                    <i className="ri-twitter-line text-3xl"></i>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-500 hover:text-amber-500 transition duration-200"
                  >
                    <i className="ri-instagram-line text-3xl"></i>
                  </a>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div
                  className="relative"
                  style={{ paddingBottom: "56.25%", height: 0 }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.318031888901!2d-0.1277583842300961!3d51.50735097963511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ce39487f3b%3A0x40a8a04a3a2e1f0!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1679800000000!5m2!1sen!2suk"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute top-0 left-0 w-full h-full"
                    title="Our Location Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
