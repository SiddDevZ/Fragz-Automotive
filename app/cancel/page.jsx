'use client'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import config from '../../config.json'

// Get the API URL from the config file
const apiUrl = config[config.environment].apiBaseUrl;

// Client component that uses navigation hooks
function CancelContent() {
  useEffect(() => {
    console.log('Checkout was canceled by the user')

    fetch(`${apiUrl}/api/create-checkout-session/cancel`)
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          console.log('Cancel response:', data);
        } catch (e) {
          console.log('Cancel response:', text);
        }
      })
      .catch(err => console.error('Error fetching cancel endpoint:', err))
  }, [])

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md my-8 text-center">
      <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      
      <h1 className="text-2xl font-bold mt-4">Checkout Cancelled</h1>
      <p className="text-gray-600 mt-2 mb-6">Your payment was not processed.</p>
      
      <div className="space-y-4">
        <Link href="/collections" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// Main component with Suspense
export default function CheckoutCancel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-opacity-60 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  )
}