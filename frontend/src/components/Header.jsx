import { useState } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful!');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNavigation = () => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/inventory');
      }  
      else if (userInfo.userType === 'Member') {
        navigate('/store');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-yellow-500">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <button
          onClick={handleNavigation}
          className="text-white text-xl font-semibold focus:outline-none"
        >
          Medi Cart
        </button>
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <div className="flex items-center space-x-4">
              {userInfo.isAdmin && (
                <button
                  onClick={() => navigate('/UserOrder')}
                  className="text-white text-sm font-medium"
                >
                  Home
                </button>
              )}
              {userInfo.isAdmin && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-white text-sm font-medium"
                >
                
                

                </button>
              )}
              {userInfo.userType === 'Member' &&  (
                <button
                  onClick={() => navigate('/feedback')}
                  className="text-white text-sm font-medium"
                >
                .
                </button>
              )}
              {userInfo.userType === 'Member' &&  (
                <button
                  onClick={() => navigate('/store')}
                  className="text-white text-sm font-medium"
                >
                  Shop
                </button>
              )}
              {userInfo.userType === 'Member' &&  (
                <button
                  onClick={() => navigate('/myschedule')}
                  className="text-white text-sm font-medium"
                >
                 .
                </button>
              )}
              {userInfo.userType === 'Member' &&  (
                <button
                  onClick={() => navigate('/pdisplay')}
                  className="text-white text-sm font-medium"
                >
                  .
                </button>
              )}
              <div className="relative">
                <button
                  className="text-white font-medium focus:outline-none"
                  onClick={toggleDropdown}
                >
                  {userInfo.name}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={() => navigate('/profile')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-white text-sm flex items-center"
              >
                <FaSignInAlt className="mr-1" />
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-white text-sm flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;