import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    isOnline: false,
    free: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setSidebardata({
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      isOnline: urlParams.get("isOnline") === "true",
      free: urlParams.get("free") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "created_at",
      order: urlParams.get("order") || "desc",
    });

    const fetchListings = async () => {
      setLoading(true);
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked, name } = e.target;

    if (name === "type") {
      setSidebardata((prev) => ({ ...prev, type: id }));
    }

    if (id === "searchTerm") {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
    }

    if (["isOnline", "free", "offer"].includes(id)) {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata((prev) => ({ ...prev, sort, order }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("isOnline", sidebardata.isOnline);
    urlParams.set("free", sidebardata.free);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* PAGE HEADER */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10">

          <h1 className="text-3xl sm:text-4xl font-extrabold">
            SEARCH <span className="text-gray-500">EVENTS</span>
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Filter and discover scientific and entertainment events
          </p>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-10">

        {/* FILTER PANEL */}
        <div className="md:w-[320px]">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* SEARCH */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Search
              </label>

              <input
                type="text"
                id="searchTerm"
                placeholder="Search events..."
                className="w-full mt-2 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            {/* TYPE */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Type
              </h3>

              <div className="space-y-2 text-sm text-gray-600">

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    id="all"
                    checked={sidebardata.type === "all"}
                    onChange={handleChange}
                  />
                  All Events
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    id="scientific"
                    checked={sidebardata.type === "scientific"}
                    onChange={handleChange}
                  />
                  Scientific
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    id="entertainment"
                    checked={sidebardata.type === "entertainment"}
                    onChange={handleChange}
                  />
                  Entertainment
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    checked={sidebardata.offer}
                    onChange={handleChange}
                  />
                  Special Offers
                </label>

              </div>
            </div>

            {/* AMENITIES */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Features
              </h3>

              <div className="space-y-2 text-sm text-gray-600">

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={sidebardata.isOnline}
                    onChange={handleChange}
                  />
                  Online Events
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="free"
                    checked={sidebardata.free}
                    onChange={handleChange}
                  />
                  Free Events
                </label>

              </div>
            </div>

            {/* SORT */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Sort
              </h3>

              <select
                id="sort_order"
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-lg"
                defaultValue="created_at_desc"
              >
                <option value="regularPrice_desc">Price High → Low</option>
                <option value="regularPrice_asc">Price Low → High</option>
                <option value="created_at_desc">Latest</option>
                <option value="created_at_asc">Oldest</option>
              </select>
            </div>

            {/* BUTTON */}
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
              SEARCH
            </button>

          </form>
        </div>

        {/* RESULTS */}
        <div className="flex-1">

          {/* HEADER */}
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              EVENTS RESULTS
            </h2>

            <span className="text-sm text-gray-500">
              {listings.length} found
            </span>
          </div>

          {/* CONTENT */}
          {loading && (
            <p className="text-gray-500">Loading events...</p>
          )}

          {!loading && listings.length === 0 && (
            <p className="text-gray-500">No events found</p>
          )}

          <div className="flex flex-wrap gap-5">
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;