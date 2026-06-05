import React from "react";

export default function About() {
  return (
    <div className="bg-white min-h-screen text-gray-900">

      {/* HERO SECTION */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-20">

          <p className="text-xs tracking-[6px] text-gray-500 font-semibold mb-4">
            EVENT PLATFORM
          </p>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            ABOUT <span className="text-gray-500">SPECIAL-EVENTS</span>
          </h1>

          <p className="text-gray-500 max-w-2xl mt-6 text-sm sm:text-base leading-relaxed">
            A modern platform for discovering, creating and managing events with a clean and powerful experience.
          </p>

        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-10">

        {/* LEFT BIG TEXT */}
        <div className="md:col-span-2 space-y-6">

          <div className="border-l-4 border-gray-900 pl-4">
            <h2 className="text-xl font-bold">Who we are</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            SpecialEvent is a modern event management platform designed for students and professionals.
            It helps users create, organize and discover events in a fast and structured way.
          </p>

          <p className="text-gray-600 leading-relaxed">
            From scientific conferences to entertainment shows and private events, everything is centralized
            into one system with a clean and scalable architecture.
          </p>

          <div className="border-l-4 border-gray-900 pl-4 mt-10">
            <h2 className="text-xl font-bold">Mission</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Our mission is to simplify event management and connect people through experiences.
            We focus on usability, speed, and accessibility.
          </p>

        </div>

        {/* RIGHT SIDEBAR CARDS */}
        <div className="space-y-4">

          <div className="border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-bold text-gray-900">100% Organized</h3>
            <p className="text-sm text-gray-500 mt-2">
              Structured event system with categories and filters.
            </p>
          </div>

          <div className="border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-bold text-gray-900">Fast Booking</h3>
            <p className="text-sm text-gray-500 mt-2">
              Book or create events in seconds.
            </p>
          </div>

          <div className="border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-bold text-gray-900">Multi-Type Events</h3>
            <p className="text-sm text-gray-500 mt-2">
              Scientific, entertainment, and private events.
            </p>
          </div>

        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-4">

          <p className="text-sm text-gray-500">
            Built for modern event experiences
          </p>

          <p className="text-sm font-semibold text-gray-900">
            SPECIAL EVENT PLATFORM
          </p>

        </div>
      </div>

    </div>
  );
}