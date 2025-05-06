import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Details() {
  const [formData, setFormData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [priceOption, setPriceOption] = useState("unit"); // Added priceOption state
  const { userInfo: currentUser } = useSelector((state) => state.auth);
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/items/IgetAll?itemId=${itemId}`);
        const data = await res.json();
        if (res.ok) {
          const selected = data.items.find((item) => item._id === itemId);
          if (selected) {
            setFormData(selected);
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchItem();
  }, [itemId]);

  const increment = () => {
    if (quantity < 20) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const selectedPrice = priceOption === "unit" ? formData.unitPrice : formData.packPrice;
    try {
      const response = await fetch('/api/items/Ccreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CurrentuserId: currentUser._id,
          ItemsN: formData.ItemsN,
          quantity: parseInt(quantity),
          price: parseFloat(selectedPrice),
          image: formData.image,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Successfully added to cart');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Error adding item to cart');
    }
  };

  // Function to split description into points
  const renderDescriptionPoints = () => {
    if (!formData.descrip) return null;

    const points = formData.descrip
      .split(/[.;\n]/)
      .map(point => point.trim())
      .filter(point => point.length > 0);

    if (points.length <= 1) {
      return <p className="mt-4 text-gray-600 font-serif">{formData.descrip}</p>;
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700 font-serif mb-2">Description:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {points.map((point, index) => (
            <li key={index} className="text-gray-600 font-serif">{point}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/store" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <FaArrowLeft className="mr-2" />
            <span className="font-serif">Back to Store</span>
          </Link>
          <Link to="/cart" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
            <FaShoppingCart className="mr-2" />
            <span className="font-serif uppercase">Cart</span>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img className="h-96 w-full object-cover md:w-96" src={formData.image} alt={formData.ItemsN} />
            </div>
            <div className="p-8">
              <h2 className="mt-2 text-3xl leading-8 font-semibold font-serif text-gray-900">{formData.ItemsN}</h2>
              <p className="mt-2 text-xl text-blue-600 font-mono">Rs: {priceOption === "unit" ? formData.unitPrice : formData.packPrice}</p>

              {/* Price option radio buttons */}
              <div className="mt-4">
                <label className="text-gray-700 font-serif mr-4">Order In:</label>
                <div className="mt-2">
                  <label className="block">
                    <input
                      type="radio"
                      name="priceOption"
                      value="unit"
                      checked={priceOption === "unit"}
                      onChange={() => setPriceOption("unit")}
                    />
                    <span className="ml-2 font-bold">LKR {formData.unitPrice} Per unit</span>
                  </label>
                  <label className="block mt-2">
                    <input
                      type="radio"
                      name="priceOption"
                      value="pack"
                      checked={priceOption === "pack"}
                      onChange={() => setPriceOption("pack")}
                    />
                    <span className="ml-2 font-bold">LKR {formData.packPrice} Per pack</span>
                  </label>
                </div>
              </div>

              {renderDescriptionPoints()}

              {/* Display Product Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Product Information:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <span className="font-semibold w-40">Manufacture Date:</span>
                    <span>
                      {formData.manufactureDate 
                        ? new Date(formData.manufactureDate).toLocaleDateString()
                        : 'Not specified'}
                    </span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="font-semibold w-40">Expiry Date:</span>
                    <span>
                      {formData.expiryDate 
                        ? new Date(formData.expiryDate).toLocaleDateString()
                        : 'Not specified'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex items-center">
                <span className="mr-3 text-gray-700 font-serif">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button onClick={decrement} className="px-3 py-1 bg-blue-600 text-white rounded-l-md hover:bg-blue-700 transition-colors duration-200">
                    <FaMinus />
                  </button>
                  <span className="px-4 py-1 text-gray-700">{quantity}</span>
                  <button onClick={increment} className="px-3 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-200">
                    <FaPlus />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-serif uppercase"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}