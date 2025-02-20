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
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
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
    </form>
  );
}
