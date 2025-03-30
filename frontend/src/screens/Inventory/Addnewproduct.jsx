import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    ItemsN: "", // Product name
    unitPrice: "", // Optional - explicitly setting as empty string to start
    packPrice: "", // Required
    quantity: "", // Quantity
    image: "", // Product image
    descrip: "", // Description
    manufactureDate: "", // Manufacture date
    expiryDate: "", // Expiry date
    size: "N/A",
    flavor: "N/A"
  });
  const [publishError, setPublishError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null); // Clear previous errors

    // Validation: Check required fields (explicitly excluding unitPrice)
    const { ItemsN, packPrice, quantity, descrip, manufactureDate, expiryDate, image } = formData;
    
    const requiredFields = [
      { field: ItemsN, name: "Product name" },
      { field: packPrice, name: "Pack price" },
      { field: quantity, name: "Quantity" },
      { field: descrip, name: "Description" },
      { field: manufactureDate, name: "Manufacture date" },
      { field: expiryDate, name: "Expiry date" }
    ];
    
    // Check for any empty required fields
    const missingFields = requiredFields.filter(item => !item.field);
    if (missingFields.length > 0) {
      setValidationError(`Missing required fields: ${missingFields.map(f => f.name).join(", ")}`);
      return;
    }

    // Validate pack price (mandatory)
    const packPriceNum = parseFloat(packPrice);
    if (isNaN(packPriceNum) || packPriceNum <= 0) {
      setValidationError("Pack price must be a valid positive number");
      return;
    }

    // Only validate unit price if a value is provided
    if (formData.unitPrice) {
      const unitPriceNum = parseFloat(formData.unitPrice);
      if (isNaN(unitPriceNum) || unitPriceNum < 0) {
        setValidationError("Unit price must be a valid non-negative number if provided");
        return;
      }
    }

    // Validate dates
    const mDate = new Date(manufactureDate);
    const eDate = new Date(expiryDate);

    if (isNaN(mDate.getTime()) || isNaN(eDate.getTime())) {
      setValidationError("Please enter valid dates");
      return;
    }

    if (eDate <= mDate) {
      setValidationError("Expiry date must be after manufacture date");
      return;
    }

    // Check if image is uploaded
    if (!image) {
      setValidationError("Please upload a product image");
      return;
    }

    try {
      setLoading(true);
      
      // Create form data for submission
      const submitData = {
        ...formData,
        // Handle unit price - if empty string or undefined, set to null
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : null,
        // Ensure packPrice is a number
        packPrice: parseFloat(formData.packPrice),
        // Ensure quantity is a number
        quantity: parseInt(formData.quantity),
        // Format dates
        manufactureDate: mDate,
        expiryDate: eDate
      };

      const res = await fetch("/api/items/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.message || "Failed to add product");
        return;
      }

      // Show success message
      alert("Product added successfully!");
      navigate("/inventory");
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <Link to="/inventory" className="flex items-center text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out mb-6">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Inventory</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Product
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="ItemsN" className="block text-gray-700 text-sm font-bold mb-2">
                Product Name *
              </label>
              <input
                id="ItemsN"
                name="ItemsN"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product name"
                value={formData.ItemsN}
                onChange={handleChange}
              />
            </div>

            {/* Unit Price - Optional */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Unit Price <span className="font-normal text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="unitPrice"
                placeholder="Enter unit price (optional)"
                value={formData.unitPrice}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-xs text-gray-500 mt-1">This field is optional and can be left empty</p>
            </div>

            {/* Pack Price - Required */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Pack Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="packPrice"
                placeholder="Enter pack price"
                value={formData.packPrice}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <div>
                <label htmlFor="manufactureDate" className="block text-sm font-bold text-gray-700">Manufacture Date *</label>
                <input
                  type="date"
                  id="manufactureDate"
                  name="manufactureDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                  value={formData.manufactureDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-bold text-gray-700">Expiry Date *</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="descrip" className="block text-gray-700 text-sm font-bold mb-2">
                Description *
              </label>
              <textarea
                id="descrip"
                name="descrip"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product description"
                rows="3"
                value={formData.descrip}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Image *
            </label>
            <div className="flex items-center justify-between">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={handleUploadImage}
                disabled={imageUploadProgress}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
              >
                {imageUploadProgress ? (
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                    styles={{
                      root: { width: '24px', height: '24px', marginRight: '8px' },
                      path: { stroke: '#ffffff' },
                      text: { fill: '#ffffff', fontSize: '24px' },
                    }}
                  />
                ) : (
                  <Upload size={20} className="mr-2" />
                )}
                Upload Image
              </button>
            </div>
            {imageUploadError && (
              <p className="mt-2 text-sm text-red-600">{imageUploadError}</p>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="Uploaded"
                className="mt-4 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>

          {/* Error Display */}
          {validationError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              disabled={loading}
            >
              {loading ? (
                <CircularProgressbar
                  value={100}
                  text="Loading..."
                  styles={{
                    root: { width: '24px', height: '24px', marginRight: '8px' },
                    path: { stroke: '#ffffff' },
                    text: { fill: '#ffffff', fontSize: '24px' },
                  }}
                />
              ) : (
                <span>Add Product</span>
              )}
            </button>
          </div>

          {publishError && (
            <p className="mt-2 text-sm text-red-600">{publishError}</p>
          )}
        </form>
      </div>
    </div>
  );
}