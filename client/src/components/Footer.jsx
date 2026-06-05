import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 mt-20">

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-black">
            SPECIAL<span className="text-red-600">EVENT</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Discover and manage events like a champion.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-bold mb-4">Navigation</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/search" className="hover:text-white">Events</Link>
            <Link to="/create-listing" className="hover:text-white">Create Event</Link>
            <Link to="/profile" className="hover:text-white">Profile</Link>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="font-bold mb-4">Categories</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <span>Scientific</span>
            <span>Entertainment</span>
            <span>Online Events</span>
            <span>Free Events</span>
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="font-bold mb-4">Social</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SpecialEvent. All rights reserved.
      </div>

    </footer>
  );
}