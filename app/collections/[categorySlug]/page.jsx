import React from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import Footer from '../../../components/Footer/Footer'
import Image from 'next/image'
import Link from 'next/link'
import categories from '../../data.js'

export default async function CategoryPage({ params }) {
  // In server components, params is directly available as a prop
  const { categorySlug } = await params;
  
  const category = categories.find(c => c.slug === categorySlug)

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-[#090909]">Category not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white animate-in">
      <Navbar />
      {/* Category Banner */}
      <header className="relative">
        <div className="relative h-64 sm:h-80 md:h-96">
          <Image
            src={category.banner}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
            <p className="mt-2 text-lg text-amber-400">{category.count}</p>
          </div>
        </div>
      </header>
      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.products.map((product) => (
            <Link 
              href={`/collections/${category.slug}/${product.slug}`}
              key={product.slug}
              className="group block overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold text-[#090909]">{product.name}</h3>
                <p className="mt-2 text-lg text-amber-500 font-medium">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
