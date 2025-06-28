import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6 py-12 flex flex-col justify-between">
      {/* 👤 Logo and Hero */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 mb-20">
        {/* 🖼️ Left Side: Logo + Text */}
        <div className="text-center md:text-left">
        <img src="/logo.png" alt="SkillSwap Logo" className="w-24 h-auto mix-blend-multiply opacity-90 " />
          <h1 className="text-5xl font-extrabold text-indigo-700 leading-tight mb-4 drop-shadow-md">
            SkillSwap Roulette
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-6">
            Discover and exchange skills with amazing people across the world.
            Learn. Teach. Grow — one swap at a time.
          </p>

          <Link
            to="/login"
            className="inline-block px-8 py-3 text-white font-semibold bg-indigo-600 rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-300"
          >
            🚀 Get Started
          </Link>
        </div>

        {/* 🎨 Right Side: Hero Illustration */}
        <div className="flex justify-center md:justify-end">
          <img src="/illustration.png" alt="SkillSwap Illustration" className="w-90 h-auto mix-blend-multiply"/>
        </div>
      </section>

      {/* ✨ Features Section */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Why SkillSwap?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🔎 Feature 1 */}
          <div className="bg-white rounded-2xl p-6 border hover:shadow-xl transition text-center">
            <div className="text-4xl mb-3 text-indigo-600">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Find Talent</h3>
            <p className="text-gray-600 text-sm">
              Connect with people who can teach you exactly what you want to learn.
            </p>
          </div>

          {/* 🎓 Feature 2 */}
          <div className="bg-white rounded-2xl p-6 border hover:shadow-xl transition text-center">
            <div className="text-4xl mb-3 text-indigo-600">🎓</div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Offer Skills</h3>
            <p className="text-gray-600 text-sm">
              Share your expertise and help others grow while building your profile.
            </p>
          </div>

          {/* 🎲 Feature 3 */}
          <div className="bg-white rounded-2xl p-6 border hover:shadow-xl transition text-center">
            <div className="text-4xl mb-3 text-indigo-600">🎲</div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">Smart Matching</h3>
            <p className="text-gray-600 text-sm">
              Use our roulette-style system to get instantly matched with skill partners.
            </p>
          </div>
        </div>
      </section>

      {/* 👣 Footer (Optional Future Addition) */}
      <footer className="text-center mt-20 text-sm text-gray-500">
        © {new Date().getFullYear()} SkillSwap Roulette. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
