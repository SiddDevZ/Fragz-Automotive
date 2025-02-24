import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
import blogs from "../../blogs";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import readingTime from "reading-time";
import { notFound } from "next/navigation";
import { Particles } from "../../../components/ui/particles";

// Custom renderers for Markdown elements
const MarkdownComponents = {
    img: ({ node, ...props }) => (
        <span className="block w-full">
            <img
                className="w-full h-auto object-contain"
                {...props}
            />
        </span>
    ),
  h1: ({ node, ...props }) => (
    <h1
      className="text-black md:text-4xl sm:text-3xl xss:text-[1.7rem] xss:leading-7 font-semibold font-sans my-2 sm:my-4"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="text-black md:text-3xl sm:text-2xl font-semibold font-sans my-2 sm:my-4"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="text-black md:text-2xl sm:text-xl font-semibold my-1.5 sm:my-3"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p
      className="text-black text-base leading-relaxed font-sans my-1 sm:my-2"
      {...props}
    />
  ),
  a: ({ node, href, ...props }) => (
    <a href={href} className="text-blue-600 underline" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 my-1 sm:my-2 text-black" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 my-1 sm:my-2 text-black" {...props} />
  ),
  li: ({ node, ...props }) => <li className="text-black my-0.5 sm:my-1" {...props} />,
};

export default async function BlogPage({ params }) {
  // Await the params object
  const { blogsSlug } = await params;

  const blog = blogs.find(
    (b) => b.title.toLowerCase().replace(/ /g, "-") === blogsSlug
  );

  if (!blog) notFound();

  const stats = readingTime(blog.description);

  return (
    <>
      <NavBar dark={true} />
      <div className="main relative flex flex-col pt-[16vh] items-center px-7 animate-in overflow-hidden">
        <div className="mt-2 main-area sm:py-10 xss:py-7 px-10 mb-5 flex flex-col items-center justify-center border border-gray-300 w-[65rem] sm:max-w-[90vw] xss:max-w-[93.5vw] relative bg-[#ffffff03] z-10">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md -z-10"></div>
          <div className="absolute sm:-top-[1.15rem] sm:-left-3 xs:-top-[0.65rem] xss:-left-1 xss:-top-[0.5rem] sm:w-6 sm:h-6 xss:w-2 xss:h-2 bg-white flex items-center justify-center">
            <span className="text-[#b4b4b4] sm:text-5xl xs:text-6xl xss:text-4xl font-[50]">
              +
            </span>
          </div>
          <div className="max-w-[42.5rem] w-full flex flex-col items-center">
            <Link
              href="/blogs"
              className="flex justify-center group items-center cursor-pointer gap-1 mb-6"
            >
              <i className="ri-arrow-left-line text-sm text-black"></i>
              <p className="text-xs group-hover:underline text-black">Blog</p>
            </Link>
            <h1 className="text-black md:text-4xl sm:text-3xl xss:text-[1.7rem] xss:leading-7 font-semibold text-center font-sans">
              {blog.title}
            </h1>
            <div className="flex justify-between w-full mt-8">
              <div className="flex gap-1 justify-center items-center">
                <i className="ri-time-line text-xs text-gray-700"></i>
                <p className="text-xs text-gray-700 font-medium">
                  {stats.text}
                </p>
              </div>
              <p className="text-xs text-gray-700 font-medium">{blog.date}</p>
            </div>
            <div className="mt-10 leading-relaxed space-y-4 font-sans w-full text-left">
              <ReactMarkdown components={MarkdownComponents}>
                {blog.description}
              </ReactMarkdown>
            </div>
            <div className="flex justify-between w-full mt-8">
              <div className="flex gap-1 justify-center items-center">
                <p className="text-xs text-gray-700">
                  Last Updated on 8 November, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Particles
        className="absolute inset-0 -z-20"
        quantity={70}
        ease={80}
        color={"#000000"}
        refresh
      />
    </>
  );
}