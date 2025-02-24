import React, { useRef, useState } from 'react';
import 'remixicon/fonts/remixicon.css';

const Featured = () => {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const products = [
    {
      name: "Two Tone Number Plates",
      price: 55.00,
      salePrice: 49.99,
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888"
    },
    {
      name: "Metro Printed Plates",
      price: 25.00,
      image: "https://images.pexels.com/photos/28560373/pexels-photo-28560373/free-photo-of-yellow-taxi-parked-in-yarraville-driveway.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Bubble Number Plates",
      price: 65.00,
      salePrice: 49.99,
      image: "https://images.pexels.com/photos/30658213/pexels-photo-30658213/free-photo-of-kia-ev9-gt-on-scenic-road-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Carbon Gel Plates",
      price: 45.00,
      salePrice: 39.99,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e"
    },
    {
      name: "Summit Plates",
      price: 55.00,
      salePrice: 40.00,
      image: "https://images.pexels.com/photos/30717327/pexels-photo-30717327/free-photo-of-modern-suv-parked-in-buenos-aires-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Novelty Name Plate",
      price: 20.00,
      image: "https://images.pexels.com/photos/30713824/pexels-photo-30713824/free-photo-of-close-up-of-a-car-grille-and-logo-in-sunlight.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Elevate Plates",
      price: 45.00,
      image: "https://images.pexels.com/photos/30646422/pexels-photo-30646422/free-photo-of-vintage-car-and-hot-air-balloons-in-cappadocia.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // The multiplier can be adjusted for faster/slower scrolling
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto relative">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div>
            <h2 className="text-3xl font-bold font-inter text-gray-900 tracking-tight">
              Premium Collections
            </h2>
            <p className="text-gray-500 mt-1.5 text-lg">
              Curated excellence for your vehicle
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
              className="p-2.5 rounded-full bg-white border border-[#7e7e7e] shadow-sm hover:shadow-md transition-all w-11 h-11 flex items-center justify-center hover:bg-gray-50"
            >
              <i className="ri-arrow-left-s-line text-xl text-gray-700" />
            </button>
            <button 
              onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
              className="p-2.5 rounded-full bg-white border border-[#7e7e7e] shadow-sm hover:shadow-md transition-all w-11 h-11 flex items-center justify-center hover:bg-gray-50"
            >
              <i className="ri-arrow-right-s-line text-xl text-gray-700" />
            </button>
          </div>
        </div>

        {/* Carousel Items */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-8 pb-10 px-2"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {products.map((product, index) => (
            <div 
              key={index}
              className="flex-shrink-0 group w-72 relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="aspect-square overflow-hidden relative rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                />
                {product.salePrice && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
                    {Math.round(((product.price - product.salePrice)/product.price)*100)}% Off
                  </span>
                )}
              </div>

              <div className="p-5">
                <h4 className="font-inter text-lg font-semibold mb-3 text-gray-900 truncate">
                  {product.name}
                </h4>
                <div className="flex gap-2 items-baseline mb-4">
                  {product.salePrice ? (
                    <>
                      <span className="text-xl font-bold text-red-600">
                        £{product.salePrice}
                      </span>
                      <span className="text-gray-400 line-through text-sm">£{product.price}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      £{product.price}
                    </span>
                  )}
                </div>
                <button className="w-full py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg transition-all duration-200 font-medium text-sm tracking-wide transform hover:scale-[1.02] active:scale-95">
                  Get Yours Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;