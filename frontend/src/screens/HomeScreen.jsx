import React from 'react';

const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[500px] mb-16">
        <img
          src="/images/pharmacy-hero.jpg"
          alt="Pharmacy Hero"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
              Your Health, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay drop-shadow-lg">
              Quality healthcare products and professional services
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Prescription Services */}
        <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer">
          <img
            src="/images/prescription.jpg"
            alt="Prescription Medicines"
            className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
            <div className="h-full w-full flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Prescription Medicines
              </h3>
              <p className="text-white text-opacity-0 group-hover:text-opacity-100 transition-opacity duration-300">
                Get your medications delivered right to your doorstep with our secure service
              </p>
            </div>
          </div>
        </div>

        {/* Healthcare Products */}
        <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer">
          <img
            src="/images/healthcare.jpg"
            alt="Healthcare Products"
            className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
            <div className="h-full w-full flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Healthcare Products
              </h3>
              <p className="text-white text-opacity-0 group-hover:text-opacity-100 transition-opacity duration-300">
                Wide range of quality health and wellness products for your daily needs
              </p>
            </div>
          </div>
        </div>

        {/* Professional Support */}
        <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer">
          <img
            src="/images/support.jpg"
            alt="Professional Support"
            className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
            <div className="h-full w-full flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Professional Support
              </h3>
              <p className="text-white text-opacity-0 group-hover:text-opacity-100 transition-opacity duration-300">
                Expert guidance from our licensed pharmacists available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fast Delivery */}
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <img src="/images/delivery.png" alt="Fast Delivery" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable medication delivery</p>
            </div>

            {/* Genuine Products */}
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <img src="/images/genuine.png" alt="Genuine Products" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Genuine Products</h3>
              <p className="text-gray-600">100% authentic medications</p>
            </div>

            {/* 24/7 Support */}
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <img src="/images/support-icon.png" alt="24/7 Support" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>

            {/* Secure Shopping */}
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <img src="/images/secure.png" alt="Secure Shopping" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
