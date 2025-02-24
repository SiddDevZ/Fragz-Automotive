"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = ({ name, onFileSelect, error }) => {
  const [preview, setPreview] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
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
          error ? "border-red-500" : "border-gray-300"
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
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default function ProductForm({ product }) {
  const [regNo, setRegNo] = useState("");
  const [quantity, setQuantity] = useState(1);
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Check for required image uploads
    product.options.forEach((option) => {
      if (option.type === "image upload" && !uploadedFiles[option.name]) {
        newErrors[option.name] = "This image is required.";
        isValid = false;
      }
    });

    // Set errors if any
    setErrors(newErrors);
    return isValid;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Prevent submission if validation fails
    }

    const formData = {
      product: product.name,
      regNo,
      quantity,
      options: selectedOptions,
      files: uploadedFiles,
    };
    console.log("Form Data:", formData);
    alert(`Added ${product.name} to cart with options: ${JSON.stringify(selectedOptions)} with quantity ${quantity}`);
  };

  return (
    <form onSubmit={handleAddToCart} className="space-y-4">
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
            onChange={(e) => setRegNo(e.target.value.toUpperCase())}
            placeholder="YOUR REG"
            className="w-full h-full bg-transparent text-center sm:text-4xl text-2xl md:text-4xl font-bold text-black placeholder-black/50 outline-none uppercase"
            required
            maxLength="10"
          />
        </div>
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

      <button
        type="submit"
        className="w-full py-[0.8rem] bg-[#fdfdfd] border-[2px] hover:shadow-md border-[#959595] tracking-wide text-[#262626] font-bold text-lg rounded-full hover:bg-[#fdfdfd] transition-all duration-300 transform hover:scale-[1.025]"
      >
        Add to Cart
      </button>
      <button
        type="submit"
        className="w-full py-[0.8rem] bg-[#fbbf28fc] border-[2px] hover:shadow-md border-[#959595] tracking-wide text-[#262626] font-bold text-lg rounded-full hover:bg-[#fbbf28] transition-all duration-300 transform hover:scale-[1.025]"
      >
        Buy Now
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
