'use client'
import React, { useState } from 'react'

export default function ProductForm({ product }) {
  const [regNo, setRegNo] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('2D Print')

  const handleAddToCart = (e) => {
    e.preventDefault()
    // Replace with your actual add-to-cart logic
    alert(
      `Added ${product.name} (${selectedStyle}) with registration ${regNo} to cart!`
    )
  }

  return (
    <form onSubmit={handleAddToCart} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Registration Number
        </label>
        <div className="relative mt-1 md:h-[4.5rem] sm:h-[4rem] h-[3.2rem] bg-yellow-400 border-2 border-black rounded-md overflow-hidden">
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value.toUpperCase())}
            placeholder="YOUR REG"
            className="w-full h-full bg-transparent text-center sm:text-4xl text-2xl md:text-4xl font-bold text-black placeholder-black/50 outline-none uppercase"
            required
            maxLength="10"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        >
          <option value="2D Print">2D Print</option>
          <option value="3D Print">3D Print</option>
          <option value="Matte Finish">Matte Finish</option>
          <option value="Glossy Finish">Glossy Finish</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition"
      >
        Add to Cart
      </button>
    </form>
  )
}
