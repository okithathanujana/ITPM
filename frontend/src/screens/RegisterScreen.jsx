import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../src/slices/usersApiSlice";
import { setCredentials } from "../../src/slices/authSlice";
import { toast } from "react-toastify";
import back from '../../src/assets/back.png';

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [userType, setUserType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState(null); // State to store calculated age
  const [address, setAddress] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.userType === "Member") {
        navigate("/store");
      }
    }
  }, [navigate, userInfo]);

  // Function to calculate age
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdayChange = (e) => {
    const selectedBirthday = e.target.value;
    setBirthday(selectedBirthday);
    const calculatedAge = calculateAge(selectedBirthday);
    setAge(calculatedAge); // Update age state
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
        mobile,
        userType,
        height,
        weight,
        birthday,
        address,
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      if (res.userType === "Trainer") {
        navigate("/trainer-dashboard");
      } else {
        navigate("/member-dashboard");
      }

      toast.success("Registration Successful!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[1350px] mt-[-440px]">
      <div className="relative flex flex-col text-gray-700 bg-black bg-opacity-70 shadow-none rounded-xl bg-clip-border mt-[300px] p-8 mb-20">
        <h4 className="block font-sans text-5xl antialiased font-semibold leading-snug tracking-normal text-center text-white">
          SIGN UP
        </h4>
        <p className="block mt-1 font-sans text-xl antialiased font-normal leading-relaxed text-center text-white">
          Welcome to the Gym Management System
        </p>

        <form
          className="max-w-screen-lg mt-8 w-80 sm:w-[40rem] flex gap-10"
          onSubmit={submitHandler}
        >
          {/* Left Part */}
          <div className="flex flex-col gap-6 w-full">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              >
                <option value="">Select User Type</option>
                <option value="Member">Member</option>
                <option value="Trainer">Trainer</option>
              </select>
            </div>
            <div className="relative h-11 w-full min-w-[200px]">
  <input
    type="text"
    placeholder="Enter address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
  />
</div>

          </div>

          {/* Right Part */}
          <div className="flex flex-col gap-6 w-full">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="number"
                placeholder="Enter height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="number"
                placeholder="Enter weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="date"
                placeholder="Enter birthday"
                value={birthday}
                onChange={handleBirthdayChange} // Updated to use new handler
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>
            {age !== null && ( // Display age if calculated
              <p className="text-white">Age: {age} years</p>
            )}

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer h-full w-full rounded-md border border-blue-gray-200 px-3 py-3 text-sm text-blue-gray-700 transition-all focus:border-2 focus:border-gray-900"
              />
            </div>
          </div>
        </form>

        <button
          className="mt-10 block w-full rounded-lg bg-yellow-500 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md hover:shadow-lg transition-all"
          type="submit"
          onClick={submitHandler}
        >
          Register
        </button>
        <p className="block mt-4 font-sans text-base text-center text-white">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-white underline ml-[10px]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
