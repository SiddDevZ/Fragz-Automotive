import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../../../components/Navbar/Navbar.jsx'
import Footer from '../../../../components/Footer/Footer.jsx'
import ProductForm from './ProductForm.jsx'
import { categories } from '../../../data.js'  // Adjust the path as needed

// Pre-generate all product routes based on categorySlug and productSlug
export async function generateStaticParams() {
  const paramsArray = []
  categories.forEach((category) => {
    category.products.forEach((product) => {
      paramsArray.push({
        categorySlug: category.slug,
        productSlug: product.slug,
      })
    })
  })
  return paramsArray
}

export default async function ProductPage({ params }) {
  const { categorySlug, productSlug } = await params
  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) {
    notFound()
  }
  const product = category.products.find((p) => p.slug === productSlug)
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar dark={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[11vh] py-12">
        {/* Two-column Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section: Sticky Product Image */}
          <div className="md:w-1/2">
            {/* The parent container now controls the height (e.g., 200px) */}
            <div className="h-[500px] sticky top-20">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+BFzGqBYDCaAAAGh0F/0QAWWcAAAAASUVORK5CYII="
              />
            </div>
          </div>

          <div className="md:w-1/2 px-2 sm:px-4 md:px-8">
            <div className="border bg-[#fefefe] p-4 sm:py-6 sm:px-9 rounded-lg shadow-sm">
              <p className='text-xs sm:text-sm font-pop text-[#2b2b2b] uppercase tracking-wider mb-2 sm:mb-3'>Fragz Custom Number Plates</p>
              <h2 className="font-inter text-3xl sm:text-3xl md:text-[2.55rem] leading-tight font-bold text-[#181818] mb-2 sm:mb-3">{product.name}</h2>
              <h4 className='font-inter sm:text-base text-sm mb-4 text-[#373737]'>{product.description}</h4>
              <div className="flex flex-row items-center justify-between mb-4">
                <p className="text-2xl tracking-wide sm:text-3xl text-[#2f2f2f] font-inter font-semibold mb-2 sm:mb-0">
                  {product.price}
                </p>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block">In Stock</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Tax Included. Shipping calculated at checkout.
              </div>
              {/* <button className='rounded-full px-4 py-2'>Add</button> */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <ProductForm product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Default Information Section */}
        <section className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-[#090909] mb-4">
            Product Information
          </h3>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Refund Policy:</span> If you are not
            satisfied with your purchase, our refund policy allows returns within
            30 days of delivery. All items must be in their original condition.
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Warranty:</span> Each product comes
            with a warranty covering manufacturing defects. Warranty periods vary
            by product.
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">Additional Info:</span> For further
            queries regarding customization, installation, or after-sales support,
            please contact our customer service.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  )
}
