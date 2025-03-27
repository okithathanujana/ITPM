import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Main = () => {
  const [Info, setInfo] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchinfo = async () => {
      try {
        const res = await fetch(`/api/items/IgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchinfo();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilter([...Info]);
    } else {
      const filteredData = Info.filter(
        (items) =>
          items.ItemsN &&
          items.ItemsN.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [query, Info]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 font-serif">Our Products</h1>
          <Link to="/cart">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center">
              <FaShoppingCart className="mr-2" />
              <span className="font-serif uppercase">Cart</span>
            </button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filter && filter.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filter.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col transform hover:scale-105 hover:translate-y-2 hover:transition-all"
              >
                <Link to={`/details/${item._id}`} className="flex-shrink-0">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                      src={item.image}
                      alt={item.ItemsN}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{item.ItemsN}</h2>
                  <div className="text-blue-600 font-bold mb-2">
                    <p className="font-bold text-black">Rs. {item.packPrice}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 truncate">{item.descrip}</p>
                  <div className="mt-auto">
                    <Link to={`/details/${item._id}`} className="block">
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200 uppercase text-sm font-serif">
                        Select Option
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-serif text-gray-600">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
