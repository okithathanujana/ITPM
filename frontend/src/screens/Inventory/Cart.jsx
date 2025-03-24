import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const [info, setInfo] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const currentUserId = userInfo ? userInfo._id : null;
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    try {
      if (!currentUserId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/items/CgetAll/${currentUserId}`);
      const data = await response.json();

      if (response.ok) {
        setInfo(data);
        const total = data.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      } else {
        console.error("Error fetching cart data:", data.message);
        setInfo([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setInfo([]);
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [currentUserId, navigate]);

  const handleDeleteItem = async (itemId) => {
    try {
      if (!window.confirm('Are you sure you want to remove this item from cart?')) {
        return;
      }

      const res = await fetch(`/api/items/deletes/${itemId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (res.ok) {
        // Remove item from local state
        setInfo(prev => prev.filter(item => item._id !== itemId));
        // Update total price
        const deletedItem = info.find(item => item._id === itemId);
        if (deletedItem) {
          setTotalPrice(prev => prev - (deletedItem.price * deletedItem.quantity));
        }
        alert(data.message || "Item successfully removed from cart");
      } else {
        alert(data.message || "Error removing item from cart");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error removing item from cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/store" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <FaArrowLeft className="mr-2" />
            <span className="font-serif">Back to Store</span>
          </Link>
          <h1 className="text-3xl font-bold text-blue-600 font-serif">Your Cart</h1>
        </div>

        {info.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {info.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.ItemsN} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.ItemsN}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">RS.{item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center mb-8">
            <FaShoppingCart className="mx-auto text-6xl text-blue-600 mb-4" />
            <p className="text-2xl font-serif text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/store" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
              Continue Shopping
            </Link>
          </div>
        )}

        {info.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-serif text-gray-800">Total</span>
              <span className="text-2xl font-bold text-blue-600">RS.{totalPrice}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200 font-serif uppercase">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;