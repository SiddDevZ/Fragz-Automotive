"use client";
import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ReCAPTCHA from "react-google-recaptcha";
import config from "../../../../config.json";

// Get the API URL from the config file
const apiUrl = config[config.environment].apiBaseUrl;

const ImageUpload = ({ name, onFileSelect, error }) => {
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  
  const MAX_FILE_SIZE = 25 * 1024 * 1024;
  
  const VALID_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
    'image/tiff'
  ];
  
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': VALID_IMAGE_TYPES.map(type => `.${type.split('/')[1]}`)
    },
    onDrop: (acceptedFiles, fileRejections) => {
      setFileError(null);
      
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0]?.code === 'file-invalid-type') {
          setFileError("Invalid file type. Please upload an image file.");
          return;
        }
      }
      
      const file = acceptedFiles[0];
      if (file) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`File is too large. Maximum size is 25MB.`);
          return;
        }
        
        // Check file type again to be sure
        if (!VALID_IMAGE_TYPES.includes(file.type)) {
          setFileError("Invalid file type. Please upload an image file.");
          return;
        }
        
        // If validation passes, set preview and pass file up
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`mt-1 cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 ${
          error || fileError ? "border-red-500" : "border-gray-300"
        } border-dashed rounded-lg hover:border-amber-500 transition-colors duration-300`}
      >
        <input {...getInputProps()} name={name} />
        {preview ? (
          <img src={preview} alt="Preview" className="h-32 object-contain" />
        ) : (
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 25MB</p>
          </div>
        )}
      </div>
      {(error || fileError) && <p className="text-red-500 text-sm mt-1">{error || fileError}</p>}
    </div>
  );
};

export default function ProductForm({ product, categorySlug, productSlug }) {
  const [regNo, setRegNo] = useState("");
  const [regNoError, setRegNoError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState(null);
  const recaptchaRef = useRef(null);
  const [selectedOptions, setSelectedOptions] = useState(
    product.options.reduce((acc, option) => {
      if (option.type === "box selector" || option.type === "inline selector") {
        acc[option.name] = option.options[0];
      }
      return acc;
    }, {})
  );
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [errors, setErrors] = useState({});

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    setErrors((prev) => ({ ...prev, [optionName]: null }));
  };

  const handleFileUpload = (optionName, file) => {
    setUploadedFiles((prev) => ({ ...prev, [optionName]: file }));
    setErrors((prev) => ({ ...prev, [optionName]: null }));
  };

  const handleRegNoChange = (e) => {
    const value = e.target.value.toUpperCase();
    setRegNo(value);
    
    // Validate the registration number
    if (value.length > 0 && value.length < 4) {
      setRegNoError("Registration number must be at least 4 characters");
    } else if (value.length > 10) {
      setRegNoError("Registration number cannot exceed 10 characters");
    } else {
      setRegNoError("");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate registration number
    if (regNo.length < 4) {
      setRegNoError("Registration number must be at least 4 characters");
      isValid = false;
    } else if (regNo.length > 10) {
      setRegNoError("Registration number cannot exceed 10 characters");
      isValid = false;
    } else {
      setRegNoError("");
    }

    // Validate file uploads
    product.options.forEach((option) => {
      if (option.type === "image upload" && !uploadedFiles[option.name]) {
        newErrors[option.name] = "This image is required.";
        isValid = false;
      }
    });

    // Validate reCAPTCHA
    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA verification");
      isValid = false;
    } else {
      setCaptchaError(null);
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    try {
      setIsLoading(true);
      const data = new FormData();
      const productId = product.id || productSlug;

      data.append('productName', product.name);
      data.append('productId', productId);
      data.append('price', product.price);
      data.append('quantity', quantity.toString());
      data.append('regNo', regNo);
      data.append('captchaToken', captchaToken); // Add the captcha token to the form data

      data.append('categorySlug', categorySlug);
      data.append('productSlug', productSlug);

      const singleItemCart = [{
        id: `${productId}-${Date.now()}`,
        productId: productId,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        regNo: regNo,
        categorySlug: categorySlug,
        productSlug: productSlug,
        selectedOptions: { ...selectedOptions },
      }];

      data.append('cartItems', JSON.stringify(singleItemCart));

      Object.keys(selectedOptions).forEach(key => {
        data.append(`options[${key}]`, selectedOptions[key]);
      });
      
      // Ensure file objects are properly appended for direct purchases
      if (Object.keys(uploadedFiles).length > 0) {
        Object.keys(uploadedFiles).forEach(key => {
          if (uploadedFiles[key] instanceof File) {
            data.append(`files[${key}]`, uploadedFiles[key]);
          }
        });
      };
      
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const session = await response.json();

      if (!session.url) {
        setError('There was a problem processing the payment.');
        return;
      }
      window.location.href = session.url;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('There was a problem processing your payment. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset captcha after form submission (whether success or failure)
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handlePurchase} className="space-y-4">
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-gray-700 font-medium">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-full">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full"
            >
              -
            </button>
            <span className="px-4 py-1 text-gray-800 font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full"
            >
              +
            </button>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Registration Number <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1 md:h-[4.5rem] sm:h-[4rem] h-[3.2rem] bg-[#facc15d2] border-2 border-black rounded-md overflow-hidden">
          <input
            type="text"
            value={regNo}
            onChange={handleRegNoChange}
            placeholder="YOUR REG"
            className="w-full h-full bg-transparent text-center sm:text-4xl text-2xl md:text-4xl font-bold text-black placeholder-black/50 outline-none uppercase"
            required
            maxLength="10"
          />
        </div>
        {regNoError && <p className="text-red-500 text-sm mt-1">{regNoError}</p>}
      </div>

      <div className="mb-10">
        {product.options.map((option, index) => (
          <div key={index} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {option.name} {option.type === "image upload" && <span className="text-red-500">*</span>}
            </label>

            {option.type === "box selector" && (
              <div className="grid grid-cols-2 gap-4">
                {option.options.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      selectedOptions[option.name] === value
                        ? "bg-amber-100 text-amber-800 border border-amber-500 shadow-sm"
                        : "bg-gray-50 text-[#525252] border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}

            {option.type === "inline selector" && (
              <div className="space-y-2.5">
                {option.options.map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name={option.name}
                      value={value}
                      checked={selectedOptions[option.name] === value}
                      onChange={() => handleOptionChange(option.name, value)}
                      className="form-radio h-[0.9rem] w-[0.9rem] text-yellow focus:ring-yellow border-gray"
                    />
                    <span className="ml-[10px]">{value}</span>
                  </label>
                ))}
              </div>
            )}

            {option.type === "image upload" && (
              <ImageUpload
                name={option.name}
                onFileSelect={(file) => handleFileUpload(option.name, file)}
                error={errors[option.name]}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-700 mb-3 mt-4">
          {error}
        </div>
      )}

      <div className="my-6 flex flex-col items-center justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LeWLyIrAAAAAA_s1ojqjweuTgyrt9pGCbbkKSC2" // Google's reCAPTCHA test key - replace with your real key in production
          onChange={(token) => {
            setCaptchaToken(token);
            setCaptchaError(null);
          }}
          onExpired={() => {
            setCaptchaToken(null);
            setCaptchaError("CAPTCHA expired, please verify again");
          }}
          onErrored={() => {
            setCaptchaToken(null);
            setCaptchaError("CAPTCHA error, please try again");
          }}
        />
        {captchaError && (
          <p className="text-red-500 text-sm mt-2">{captchaError}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          This helps us prevent spam and automated submissions
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-[0.8rem] bg-[#fbbf28fc] border-[2px] ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.025]'
        } border-[#959595] tracking-wide text-[#262626] font-bold text-lg rounded-full hover:bg-[#fbbf28] transition-all duration-300 transform`}
      >
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>
      
      <div className="mt-6 p-4 bg-[#f0fdf49f] border border-green-200 rounded-lg">
        <div className="flex items-center mb-2">
          <svg className="h-5 w-5 text-green-600 mr-2" fill="#16a34a" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8.96456 18C8.72194 19.6961 7.26324 21 5.5 21C3.73676 21 2.27806 19.6961 2.03544 18H1V6C1 5.44772 1.44772 5 2 5H16C16.5523 5 17 5.44772 17 6V8H20L23 12.0557V18H20.9646C20.7219 19.6961 19.2632 21 17.5 21C15.7368 21 14.2781 19.6961 14.0354 18H8.96456ZM15 7H3V15.0505C3.63526 14.4022 4.52066 14 5.5 14C6.8962 14 8.10145 14.8175 8.66318 16H14.3368C14.5045 15.647 14.7296 15.3264 15 15.0505V7ZM17 13H21V12.715L18.9917 10H17V13ZM17.5 19C18.1531 19 18.7087 18.5826 18.9146 18C18.9699 17.8436 19 17.6753 19 17.5C19 16.6716 18.3284 16 17.5 16C16.6716 16 16 16.6716 16 17.5C16 17.6753 16.0301 17.8436 16.0854 18C16.2913 18.5826 16.8469 19 17.5 19ZM7 17.5C7 16.6716 6.32843 16 5.5 16C4.67157 16 4 16.6716 4 17.5C4 17.6753 4.03008 17.8436 4.08535 18C4.29127 18.5826 4.84689 19 5.5 19C6.15311 19 6.70873 18.5826 6.91465 18C6.96992 17.8436 7 17.6753 7 17.5Z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-green-800">Express Delivery</h3>
        </div>
        <p className="text-green-700">
          Estimated delivery: <span className="font-bold">3-5 business days</span>
        </p>
      </div>
      <img src="https://cdn.shopify.com/s/files/1/0343/6157/3514/files/Trustpilot-4-300x30.png?v=1713373617" className='mx-auto mt-4' alt="" />
    </form>
  );
}
