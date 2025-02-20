'use client'
import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar dark={true} />

      {/* Hero Section */}
      <header
        className="relative w-full h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1579547621706-1a9c79d5a815?auto=format&fit=crop&w=1500&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-amber-400 max-w-2xl">
            We’re here to help with your car number plate needs. Whether you have questions about our plates or need assistance with your order – drop us a message.
          </p>
          {/* <a
            href="#contactForm"
            className="mt-6 inline-block px-8 py-4 bg-amber-500 text-white font-semibold rounded-full shadow-lg hover:bg-amber-600 transition"
          >
            Contact Us
          </a> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div id="contactForm" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#090909] mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-lg font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="How can we help you?"
                  required
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Type your message here..."
                  required
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Details & Map */}
          <div className="flex flex-col gap-12">
            {/* Contact Information */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#090909] mb-6">Contact Information</h2>
              <div className="flex items-center space-x-4 mb-4">
                <i className="ri-phone-line text-3xl text-amber-500"></i>
                <p className="text-xl text-gray-700">+44 123 456 7890</p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <i className="ri-mail-line text-3xl text-amber-500"></i>
                <p className="text-xl text-gray-700">support@numberplates.com</p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <i className="ri-map-pin-line text-3xl text-amber-500"></i>
                <p className="text-xl text-gray-700">123 Car Street, London, UK</p>
              </div>
              {/* Social Media Links */}
              <div className="flex space-x-6 mt-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-700 hover:text-amber-500 transition"
                >
                  <i className="ri-facebook-circle-line text-4xl"></i>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-gray-700 hover:text-amber-500 transition"
                >
                  <i className="ri-twitter-line text-4xl"></i>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-700 hover:text-amber-500 transition"
                >
                  <i className="ri-instagram-line text-4xl"></i>
                </a>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2434.7914422259532!2d4.846715115802702!3d52.392330979790174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47cf563ab55249e3%3A0x59292938484b2f34!2sYour%20Business%20Location!5e0!3m2!1sen!2suk!4v1679800000000!5m2!1sen!2suk"
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
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage
