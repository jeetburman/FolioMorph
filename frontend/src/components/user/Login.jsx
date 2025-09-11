import { useState } from "react";
import { HiX } from "react-icons/hi";

export default function SignUp({ open, onClose, onSwitch }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  if (!open) return null;

  const loginSubmit = (e) => {
    e.preventDefault();

    // console.log(loginEmail, loginPassword);

    setLoginEmail("");
    setLoginPassword("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3">
      <div className="p-7 bg-white rounded-md relative">
        <h2 className="text-3xl font-semibold mb-4 text-blue-700 text-center">
          Login
        </h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"
        >
          <HiX size={28} />
        </button>

        <div className="space-y-3 bg-white rounded-lg p-6 max-w-md w-full relative overflow-y-auto max-h-[90vh] border-2">
          <form onSubmit={loginSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Eamil"
              name="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="text-gray-800 w-full border border-gray-300 rounded px-4 py-2 bg-slate-50 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="text-gray-800 w-full border border-gray-300 rounded px-4 py-2 bg-slate-50 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>

            <p className="text-black text-center">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-blue-500 underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
