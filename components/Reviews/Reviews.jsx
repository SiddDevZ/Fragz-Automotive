import React, { useState, useEffect } from "react";
import "./Reviews.css";
import Image from "next/image";

// Updated testimonial data
const testimonials = [
  {
    id: 1,
    name: "John Smith",
    purchase: "Two Tone Number Plates",
    quote:
      "The Two Tone Number Plates added a sleek look to my car. The quality is top-notch!",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    name: "Emily Johnson",
    purchase: "Metro Printed Number Plates",
    quote:
      "I love the Metro Printed Number Plates! They arrived quickly and look fantastic.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    purchase: "Bubble Number Plates",
    quote:
      "The Bubble Number Plates are a fun addition to my vehicle. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 4,
    name: "Jessica Davis",
    purchase: "Forged Carbon Gel Plates",
    quote:
      "The Forged Carbon Gel Plates are durable and stylish. Perfect for my car!",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 5,
    name: "David Wilson",
    purchase: "Summit Number Plates",
    quote:
      "Got the Summit Number Plates on sale. Great value for the price!",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: 6,
    name: "Sophia Martinez",
    purchase: "3/4D Novelty Name Plate",
    quote:
      "The 3/4D Novelty Name Plate is a unique touch to my collection. Love it!",
    image: "https://randomuser.me/api/portraits/women/61.jpg",
  },
  {
    id: 7,
    name: "James Anderson",
    purchase: "Elevate Number Plates",
    quote:
      "Elevate Number Plates gave my car a premium look. Very satisfied!",
    image: "https://randomuser.me/api/portraits/men/72.jpg",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    purchase: "Bubble Number Plates",
    quote:
      "The Bubble Number Plates are exactly what I was looking for. Great service!",
    image: "https://randomuser.me/api/portraits/women/81.jpg",
  },
  {
    id: 9,
    name: "William Moore",
    purchase: "Forged Carbon Gel Plates",
    quote:
      "Forged Carbon Gel Plates are a game-changer. They look amazing on my car.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  {
    id: 10,
    name: "Ava Thompson",
    purchase: "Summit Number Plates",
    quote:
      "Summit Number Plates were a great choice. The sale price was unbeatable!",
    image: "https://randomuser.me/api/portraits/women/91.jpg",
  },
  {
    id: 11,
    name: "Liam Johnson",
    purchase: "Custom Engraved Plates",
    quote:
      "The Custom Engraved Plates are a perfect fit for my car. The engraving is precise, and the plates are made from high-quality materials.",
    image: "https://randomuser.me/api/portraits/men/95.jpg",
  },
  {
    id: 12,
    name: "Emma Williams",
    purchase: "Vintage Style Plates",
    quote:
      "The Vintage Style Plates are a beautiful addition to my classic car. The design is authentic, and the quality is exceptional.",
    image: "https://randomuser.me/api/portraits/women/99.jpg",
  },
  {
    id: 13,
    name: "Noah Miller",
    purchase: "Reflective Number Plates",
    quote:
      "Reflective Number Plates are a great safety feature. They are highly visible at night and look great during the day.",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: 14,
    name: "Isabella Garcia",
    purchase: "3D Gel Plates",
    quote:
      "The 3D Gel Plates add a modern touch to my car. The raised lettering is a nice detail that stands out.",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    id: 15,
    name: "Mason Martinez",
    purchase: "Carbon Fiber Plates",
    quote:
      "Carbon Fiber Plates are lightweight and durable. They give my car a sporty look that I love.",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: 16,
    name: "Sophia Rodriguez",
    purchase: "Classic Black Plates",
    quote:
      "The Classic Black Plates are timeless. They match my car perfectly and are made from high-quality materials.",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    id: 17,
    name: "Ethan Lee",
    purchase: "Personalized Plates",
    quote:
      "Personalized Plates are a great way to express myself. The customization options are fantastic, and the quality is excellent.",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    id: 18,
    name: "Mia Walker",
    purchase: "European Style Plates",
    quote:
      "The European Style Plates give my car a unique look. They are well-made and fit perfectly.",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    id: 19,
    name: "Alexander Harris",
    purchase: "Chrome Number Plates",
    quote:
      "Chrome Number Plates add a touch of luxury to my car. They are shiny and durable, making them a great choice.",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    id: 20,
    name: "Amelia Clark",
    purchase: "Minimalist Plates",
    quote:
      "The Minimalist Plates are sleek and modern. They complement my car's design perfectly.",
    image: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: 21,
    name: "Lucas Young",
    purchase: "Matte Finish Plates",
    quote:
      "Matte Finish Plates are a great choice for a subtle look. They are well-made and look fantastic on my car.",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    id: 22,
    name: "Harper King",
    purchase: "Gold Plated Number Plates",
    quote:
      "Gold Plated Number Plates are luxurious and eye-catching. They add a touch of elegance to my vehicle.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 23,
    name: "Benjamin Wright",
    purchase: "Silver Number Plates",
    quote:
      "Silver Number Plates are a classic choice. They are durable and look great on my car.",
    image: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    id: 24,
    name: "Charlotte Scott",
    purchase: "Floral Design Plates",
    quote:
      "The Floral Design Plates are beautiful and unique. They add a personal touch to my car.",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: 25,
    name: "Henry Green",
    purchase: "Camouflage Plates",
    quote:
      "Camouflage Plates are a fun and unique choice. They are well-made and look great on my car.",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
  },
  {
    id: 26,
    name: "Ella Adams",
    purchase: "Animal Print Plates",
    quote:
      "Animal Print Plates are a bold choice. They are well-made and add a unique touch to my car.",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: 27,
    name: "Daniel Baker",
    purchase: "Neon Number Plates",
    quote:
      "Neon Number Plates are vibrant and eye-catching. They are a great choice for a unique look.",
    image: "https://randomuser.me/api/portraits/men/27.jpg",
  },
  {
    id: 28,
    name: "Grace Nelson",
    purchase: "Holographic Plates",
    quote:
      "Holographic Plates are a fun and unique choice. They are well-made and look great on my car.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: 29,
    name: "Jack Carter",
    purchase: "Glow in the Dark Plates",
    quote:
      "Glow in the Dark Plates are a fun and unique choice. They are well-made and look great on my car.",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: 30,
    name: "Lily Mitchell",
    purchase: "Rainbow Plates",
    quote:
      "Rainbow Plates are vibrant and eye-catching. They are a great choice for a unique look.",
    image: "https://randomuser.me/api/portraits/women/30.jpg",
  },
];

const ReviewChild = ({ name, purchase, quote, image }) => {
  return (
    <div className="child w-full rounded-3xl bg-[#f4f4f4] p-8 pb-8 mb-6 shadow-lg">
      <div className="flex items-center">
        <img src={image} className="h-10 w-10 rounded-full" alt="" />
        <div className="flex flex-col ml-4 justify-center">
          <h2 className="font-semibold text-gray-800">{name}</h2>
          <h3 className="text-sm text-gray-600">{purchase}</h3>
        </div>
      </div>
      <p className="text-gray-700 mt-3">{quote}</p>
    </div>
  );
};

const Reviews = () => {
  const [hoveredColumns, setHoveredColumns] = useState([false, false, false]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (columnIndex) => {
    setHoveredColumns((prev) => {
      const newState = [...prev];
      newState[columnIndex] = true;
      return newState;
    });
  };

  const handleMouseLeave = (columnIndex) => {
    setHoveredColumns((prev) => {
      const newState = [...prev];
      newState[columnIndex] = false;
      return newState;
    });
  };

  return (
    <div className="container mt-14 h-[90vh] overflow-hidden mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((columnIndex) => (
          <div
            key={columnIndex}
            className="relative"
            onMouseEnter={() => handleMouseEnter(columnIndex)}
            onMouseLeave={() => handleMouseLeave(columnIndex)}
          >
            <div
              className={`vertical-scroll ${
                hoveredColumns[columnIndex] ? "hovered" : ""
              } ${columnIndex === 0 || columnIndex === 2 ? "fast" : ""}`}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => {
                if (
                  (windowWidth >= 1024 && index % 3 === columnIndex) ||
                  (windowWidth >= 640 &&
                    windowWidth < 1024 &&
                    index % 2 === columnIndex % 2) ||
                  windowWidth < 640
                ) {
                  return (
                    <ReviewChild
                      key={`${testimonial.id}-${index}`}
                      name={testimonial.name}
                      purchase={testimonial.purchase}
                      quote={testimonial.quote}
                      image={testimonial.image}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
