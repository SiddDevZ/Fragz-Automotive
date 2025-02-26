import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import blogData from "../blogs.js";
import Link from "next/link";

const page = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar dark={true} />
      <main className="py-8 px-2 mt-[13vh] sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center font-inter mb-10">
            Company Blogs
          </h1>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogData.map((blog) => {
              // Extract first paragraph and remove markdown
              const firstParagraph =
                blog.description
                  .split("\n")
                  .find(
                    (line) => line.trim().length > 0 && !line.startsWith("#")
                  )
                  ?.trim() || "";

              const slug = blog.title.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={blog.id}
                  className="border bg-[#fdfdfd] rounded-xl overflow-hidden hover:shadow-sm transition-all ease-in-out duration-300"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6 flex flex-col">
                    <p className="text-xs text-gray-500 font-inter">
                      {blog.date}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold font-pop text-gray-900">
                      {blog.title}
                    </h2>
                    <div className="mt-3 text-gray-700 font-inter flex-grow line-clamp-3">
                      {firstParagraph}
                    </div>
                    <div className="mt-4">
                      <Link href={`/blogs/${slug}`} passHref>
                        <button className="px-4 py-2 bg-black text-white font-semibold rounded-full ease-in-out hover:scale-[1.05] transition-all duration-300">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
