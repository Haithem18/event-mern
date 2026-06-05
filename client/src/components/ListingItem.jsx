import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  console.log(listing);

  return (
    <div className="group relative bg-gradient-to-b from-black via-zinc-900 to-black text-white shadow-2xl overflow-hidden rounded-xl w-full sm:w-[330px] border border-red-600/20 hover:border-red-600 transition-all duration-300">

      <Link to={`/listing/${listing._id}`}>

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={listing.imageUrls[0] || ""}
            alt="listing cover"
            className="h-[320px] sm:h-[240px] w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* DARK UFC OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* TYPE BADGE */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
            {listing.type}
          </div>

          {/* OFFER BADGE */}
          {listing.offer && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-black px-3 py-1 uppercase">
              DEAL
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-3">

          {/* TITLE */}
          <p className="truncate text-lg font-black uppercase tracking-wide text-white">
            {listing.name}
          </p>

          {/* LOCATION */}
          <div className="flex items-center gap-2 text-gray-300">
            <MdLocationOn className="h-4 w-4 text-red-500" />
            <p className="text-sm truncate w-full">
              {listing.address}
            </p>
          </div>

          {/* DESCRIPTION */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* PRICE SECTION */}
          <div className="flex items-center justify-between mt-2">

            <div className="text-red-500 font-black text-lg">
              DNT
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.ticketPrice.toLocaleString("en-US")}
            </div>

            <div className="text-xs text-gray-400 uppercase">
              {listing.type === "scientific" ? "Premium Event" : "Live Event"}
            </div>

          </div>

          {/* SEATS */}
          <div className="mt-2 border-t border-white/10 pt-2 text-xs text-gray-400 flex justify-between">

            <span className="uppercase tracking-wider">
              Capacity
            </span>

            <span className="text-white font-bold">
              {listing.nbrP > 1
                ? `${listing.nbrP} spots`
                : `${listing.nbrP} spot`}
            </span>

          </div>

        </div>
      </Link>
    </div>
  );
}