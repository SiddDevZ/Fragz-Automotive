'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import config from '../../config.json';

// Get the API URL from the config file
const apiUrl = config[config.environment].apiBaseUrl;

// Create a client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyProcessed, setAlreadyProcessed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    // Clear cart on successful checkout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    if (!session_id) return;

    async function verifyPayment() {
      setLoading(true); // Ensure loading state is set
      setError(null); // Reset error state
      setAlreadyProcessed(false); // Reset processed state

      try {
        // CORRECTED FETCH URL using config:
        const response = await fetch(`${apiUrl}/api/success?session_id=${session_id}`);
        
        // Use response.json() for safer parsing
        const data = await response.json(); 

        if (!response.ok) {
          // Throw error using the message from the JSON response if available
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        console.log('Payment response:', data);
        
        if (data.alreadyProcessed) {
          setAlreadyProcessed(true);
        } else if (data.success && data.session) { // Check for success flag and session data
          setOrderDetails(data.session);
        } else {
          // Handle cases where response is ok but data is not as expected
          throw new Error('Invalid data structure received from server.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        // Set specific error messages based on error type
        if (err instanceof SyntaxError) {
          setError('Received an invalid response from the server. Please try again later.');
        } else {
          setError(err.message || 'Failed to verify payment. Please contact support.');
        }
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [session_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-60 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Verifying your payment...</p>
          <p className="text-gray-500 mt-2">This could take anywhere from 10-30 seconds.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment Verification Failed</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <Link href="/" className="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded-md shadow-sm hover:bg-gray-700 transition-all duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-white">Payment Successful!</h1>
          <p className="text-[#ffffffee] mt-2 w-[75%] mx-auto">Thank you for your payment. Your order will be processed shortly.</p>
        </div>

        {alreadyProcessed ? (
          <div className="p-6 text-center">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
              <p className="text-yellow-700 font-medium">This order has already been processed.</p>
              <p className="text-gray-600 mt-2">Your payment was successful and your order is being processed.</p>
              <p className="text-gray-600 mt-1">You should have received a confirmation email with your order details.</p>
            </div>
            <p className="text-gray-500 text-sm mt-4">If you have any questions about your order, please contact our support team.</p>
          </div>
        ) : orderDetails && (
          <div className="p-6">
            <h2 className="font-bold text-xl text-gray-800 mb-4 border-b border-gray-200 pb-2">Order Details</h2>
            
            <div className="space-y-3">
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {item.productName || `Registration: ${item.regNo}`}
                      </h3>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Registration:</span>
                        <span className="text-gray-600 font-medium">{item.regNo}</span>
                      </div>
                      
                      {item.options && Object.keys(item.options).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-gray-700 text-sm mb-1">Selected Options:</p>
                          <ul className="space-y-1">
                            {Object.entries(item.options).map(([key, value]) => (
                              <li key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600">{key}:</span>
                                <span className="text-gray-800">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Order ID:</span>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-semibold">
                      {orderDetails.id.length > 16 
                        ? `${orderDetails.id.substring(0, 16)}...` 
                        : orderDetails.id}
                    </span>
                    <button 
                      onClick={handleCopyOrderId}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      title={copied ? "Copied!" : "Copy order ID"}
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Amount:</span>
                <span className="text-gray-600 font-semibold">£{orderDetails.amount.toFixed(2)}</span>
              </div>
              
              {orderDetails.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Email:</span>
                  <span className="text-gray-600">{orderDetails.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
          <Link href="/" className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition-all duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-60 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}