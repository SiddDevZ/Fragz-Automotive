// 'use client'
import React from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
// import { useRouter } from 'next/navigation'
import Footer from '../../components/Footer/Footer.jsx'
import Link from 'next/link.js'
import Image from 'next/image'
import { categories } from '../data.js' 

const CollectionsPage = () => {
  // const router = useRouter()
  
  return (
    <div className='min-h-screen w-full bg-white'>
      <Navbar dark={true} />
      
      <main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-[20vh] pb-20'>
        <h1 className='text-4xl font-bold text-[#090909] text-center mb-12'>
          Explore Premium Collections
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`${category.redirect}`}
              // onClick={() => router.push(category.redirect)}
              className='group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300'
            >
              <div className='relative h-80'>
                <Image
                  src={category.img}
                  alt={category.name}
                  fill
                  loading="lazy"
                  quality={80}
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/40 to-transparent' />
                <div className='absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 transition-all duration-500 rounded-2xl' />
              </div>

              <div className='absolute bottom-0 left-0 right-0 p-6 text-white space-y-2'>
                <h3 className='text-2xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                  {category.name}
                </h3>
                <p className='text-[#fbbe24df] group-hover:-translate-y-2 font-medium transition-transform duration-300'>
                  {category.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CollectionsPage
