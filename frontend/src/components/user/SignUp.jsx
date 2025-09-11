import { useState } from "react";
import { HiX } from "react-icons/hi";

export default function SignUp({ open, onClose, onSwitch }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(user);

    setUser({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3">
      <div className="p-7 bg-white rounded-md relative">
        <h2 className="text-3xl font-semibold mb-4 text-blue-700 text-center">
          Sign Up
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"
        >
          <HiX size={28} />
        </button>

        <div className="space-y-3 bg-white rounded-lg p-6 max-w-md w-full relative overflow-y-auto max-h-[90vh] border-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="text-gray-800 w-full border border-gray-300 rounded px-4 py-2 bg-slate-50 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Eamil"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="text-gray-800 w-full border border-gray-300 rounded px-4 py-2 bg-slate-50 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="text-gray-800 w-full border border-gray-300 rounded px-4 py-2 bg-slate-50 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>

            <p className="text-black text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-blue-500 underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
