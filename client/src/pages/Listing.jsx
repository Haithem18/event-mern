import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from 'react-redux';

import {
  FaMapMarkerAlt,
  FaMoneyBill,
  FaShare,
  FaStream,
  FaUser
} from "react-icons/fa";

import Contact from '../components/Contact';

const Listing = () => {
  SwiperCore.use([Navigation]);

  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* LOADING / ERROR */}
      {loading && (
        <p className="text-center py-20 text-xl text-gray-300">
          Loading fight details...
        </p>
      )}

      {error && (
        <p className="text-center py-20 text-xl text-red-500">
          Something went wrong
        </p>
      )}

      {listing && !loading && !error && (
        <div className="pb-20">

          {/* IMAGE SLIDER (UFC HERO STYLE) */}
          <Swiper navigation className="relative">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[600px] w-full relative"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  {/* DARK UFC OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* TITLE OVER IMAGE */}
                  <div className="absolute bottom-10 left-6 md:left-16">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
                      {listing.name}
                    </h1>

                    <p className="text-gray-300 mt-2 text-sm md:text-base">
                      Live Event Experience
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* SHARE BUTTON */}
          <div
            className="fixed top-24 right-6 z-50 bg-red-600 hover:bg-red-700 text-white w-12 h-12 flex items-center justify-center rounded-full cursor-pointer shadow-lg"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <FaShare />
          </div>

          {copied && (
            <p className="fixed top-40 right-6 z-50 bg-white text-black px-3 py-1 rounded shadow">
              Link copied
            </p>
          )}

          {/* CONTENT CARD */}
          <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">

            <div className="bg-zinc-900 border border-red-600/20 rounded-2xl shadow-2xl p-6 md:p-10">

              {/* PRICE HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <h2 className="text-2xl md:text-3xl font-black uppercase">
                  {listing.name}
                </h2>

                <div className="text-red-500 text-2xl font-black">
                  DNT
                  {listing.offer
                    ? listing.discountPrice.toLocaleString('en-US')
                    : listing.ticketPrice.toLocaleString('en-US')}
                </div>

              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-3 mt-5">

                <span className="bg-red-600 text-white px-3 py-1 text-xs uppercase font-bold">
                  {listing.type}
                </span>

                {listing.offer && (
                  <span className="bg-yellow-400 text-black px-3 py-1 text-xs font-bold uppercase">
                    Discount Active
                  </span>
                )}

              </div>

              {/* ADDRESS */}
              <p className="flex items-center gap-2 mt-6 text-gray-300">
                <FaMapMarkerAlt className="text-red-500" />
                {listing.address}
              </p>

              {/* DESCRIPTION */}
              <p className="mt-6 text-gray-400 leading-relaxed text-sm">
                <span className="text-white font-bold">Description: </span>
                {listing.description}
              </p>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">

                <div className="flex items-center gap-2 bg-black p-3 rounded-lg border border-white/10">
                  <FaUser className="text-red-500" />
                  <span>
                    {listing.nbrP > 1
                      ? `${listing.nbrP} spots available`
                      : `${listing.nbrP} spot`}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black p-3 rounded-lg border border-white/10">
                  <FaStream className="text-red-500" />
                  {listing.isOnline ? "Online Event" : "On-site Event"}
                </div>

                <div className="flex items-center gap-2 bg-black p-3 rounded-lg border border-white/10">
                  <FaMoneyBill className="text-red-500" />
                  {listing.free ? "Free Entry" : "Paid Event"}
                </div>

              </div>

              {/* ACTION BUTTON */}
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 uppercase font-bold tracking-widest rounded-lg"
                  >
                    Contact Organizer
                  </button>
                )}

              {/* CONTACT FORM */}
              {contact && (
                <div className="mt-6">
                  <Contact listing={listing} />
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;