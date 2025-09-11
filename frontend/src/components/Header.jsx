import React from "react";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import Login from "./user/Login";
import SignUp from "./user/SignUp";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="bg-white text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="text-2xl text-blue-900 molle-regular-italic">
          FOLIOMORPH
        </div>

        <div className="hidden md:flex items-center space-x-6 text-blue-700 font-semibold">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="hover:underline"
          >
            Log In
          </button>
          <button
            onClick={() => setIsSignUpOpen(true)}
            className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden text-blue-950">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 px-4 py-4 space-y-2">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="block text-white"
          >
            Log In
          </button>
          <button
            onClick={() => setIsSignUpOpen(true)}
            className="w-full bg-white text-blue-600 px-4 py-1 rounded"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* signup modal */}
      <SignUp
        open={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitch={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <Login
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitch={() => {
          setIsSignUpOpen(true);
          setIsLoginOpen(false);
        }}
      />
    </header>
  );
};

export default Header;
