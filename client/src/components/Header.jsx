import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-black text-white border-b border-zinc-900">
      
      {/* TOP BAR (like UFC navigation strip) */}
      <div className="bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12 text-xs uppercase tracking-widest text-zinc-400">

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Events</span>
            <span className="hover:text-white cursor-pointer">News</span>
            <span className="hover:text-white cursor-pointer">Watch</span>
            <span className="hover:text-white cursor-pointer">Rankings</span>
          </div>

          <div className="hidden md:flex gap-4">
            <span className="hover:text-white cursor-pointer">EVENT STREAMING</span>
            <span className="text-red-500 font-semibold">LIVE</span>
          </div>

        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO AREA (UFC style bold block) */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-1 h-8 bg-red-600"></div>

          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-[3px]">
              SPECIAL
            </h1>
            <p className="text-red-600 text-xs tracking-[6px]">
              EVENTS
            </p>
          </div>
        </Link>

        {/* SEARCH (center like UFC search feel) */}
        <form className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 px-4 py-2 w-[380px] rounded-md focus-within:border-red-600 transition">
          <FaSearch className="text-zinc-400 mr-2" />
          <input
            type="text"
            placeholder="Search events,  news..."
            className="bg-transparent w-full text-sm focus:outline-none text-white placeholder-zinc-500"
          />
        </form>

        {/* RIGHT NAV */}
        <div className="flex items-center gap-6">

          <Link to="/search">
            <span className="text-sm uppercase tracking-widest text-zinc-300 hover:text-white transition">
              Explore
            </span>
          </Link>

          <Link to="/about">
            <span className="text-sm uppercase tracking-widest text-zinc-300 hover:text-white transition">
              About
            </span>
          </Link>

          {/* USER */}
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser?.avatar || "https://via.placeholder.com/40"}
                className="w-9 h-9 rounded-full object-cover border border-zinc-700 hover:border-red-600 transition"
              />
            ) : (
              <button className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-widest">
                Sign In
              </button>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;