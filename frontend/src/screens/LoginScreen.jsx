import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/inventory');
      } else if (userInfo.userType === 'Member') {
        navigate('/store');
      } else {
        navigate('/'); // Fallback or home page if no userType found
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      if (res.isAdmin) {
        navigate('/admin-dashboard');
      } else if (res.userType === 'Trainer') {
        navigate('/trainer-dashboard');
      } else if (res.userType === 'Member') {
        navigate('/member-dashboard');
      } else {
        navigate('/'); // Fallback or home page
      }

      toast.success('Login Successful!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center">
      <div className="relative flex flex-col text-gray-700 bg-black bg-opacity-70 shadow-none rounded-xl bg-clip-border p-8 mb-20 w-full max-w-md">
        <h4 className="text-5xl font-semibold text-center text-white">Sign In</h4>
        <p className="mt-1 text-xl font-normal text-center text-white">
          Welcome back to the Gym Management System
        </p>

        <form onSubmit={submitHandler} className="mt-8 flex flex-col gap-6">
          <div className="relative h-11 w-full">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-2 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
            />
          </div>

          <div className="relative h-11 w-full">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-2 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="mt-10 block w-full rounded-lg bg-yellow-500 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </form>

        {isLoading && <Loader />}

        <p className="mt-4 text-center text-white">
          Forgot Password?{' '}
          <Link to="/forgot-password" className="text-yellow-500 underline">
            Reset Here
          </Link>
        </p>

        <p className="mt-4 text-center text-white">
          New Customer?{' '}
          <Link to="/register" className="text-yellow-500 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
