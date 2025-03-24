import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPrescriptionBottleAlt, FaFirstAid, FaUserMd } from 'react-icons/fa';

const OnboardScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to MediCart
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted online pharmacy for all your healthcare needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
                alt="Prescription Medicines"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <FaPrescriptionBottleAlt className="text-blue-600 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Prescription Medicines
                </h3>
              </div>
              <p className="text-gray-600">
                Get your prescribed medications delivered right to your doorstep with our secure and reliable service
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576671081837-49b1a2a48eef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
                alt="Healthcare Products"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <FaFirstAid className="text-blue-600 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Healthcare Products
                </h3>
              </div>
              <p className="text-gray-600">
                Browse our extensive collection of high-quality healthcare and wellness products for your daily needs
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80"
                alt="Expert Support"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <FaUserMd className="text-blue-600 text-2xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Expert Support
                </h3>
              </div>
              <p className="text-gray-600">
                Get professional guidance and support from our experienced healthcare team whenever you need it
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transform transition-all duration-300 hover:scale-105"
          >
            Get Started
            <FaArrowRight className="ml-2" />
          </Link>
          <p className="mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardScreen;
