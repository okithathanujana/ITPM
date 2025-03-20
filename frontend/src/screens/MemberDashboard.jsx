import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BMICalc from '../components/BMICalculator';

const MemberDashboard = () => {
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = useSelector((state) => state.auth.userInfo?._id);

  useEffect(() => {
    const fetchUserPackages = async () => {
      try {
        const response = await fetch(`/api/packages/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user packages');
        }
        const data = await response.json();
        console.log('Fetched user packages:', data);
        setUserPackages(data);
      } catch (err) {
        console.error('Error fetching user packages:', err);
        setError('Error fetching user packages');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPackages();
    }
  }, [userId]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Member Dashboard</h1>
      
      {/* Flex layout for BMI, Enroll, and Timer */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 space-y-4 md:space-y-0 md:space-x-4">
        
        {/* Enroll Package Section */}
        <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enroll Package</h2>
          <ShowPackage />
        </div>
        
        {/* Package Timer Section */}
        <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Package Timer</h2>
          {userPackages.length > 0 ? (
            <PackageTimer 
              startDate={userPackages[0].startDate} 
              validity={userPackages[0].validity} 
            />
          ) : (
            <p className="text-gray-600">No active packages</p>
          )}
        </div>
        
        {/* BMI Calculator Section */}
        <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">BMI Calculator</h2>
          <BMICalc />
        </div>
      </div>

      <PackagePlans />
      
    </div>
  );
};

export default MemberDashboard;
