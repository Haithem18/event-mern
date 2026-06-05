import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import ListingItem from "../components/ListingItem";
import Footer from "../components/Footer";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [entertainmentListings, setEntertainmentListings] = useState([]);
  const [scientificListings, setScientificListings] = useState([]);

  SwiperCore.use({ Navigation });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, scientificRes, entertainmentRes] = await Promise.all([
          fetch("/api/listing/get?offer=true&limit=4"),
          fetch("/api/listing/get?type=scientific&limit=4"),
          fetch("/api/listing/get?type=entertainment&limit=4"),
        ]);

        const offerData = await offerRes.json();
        const scientificData = await scientificRes.json();
        const entertainmentData = await entertainmentRes.json();

        setOfferListings(Array.isArray(offerData) ? offerData : []);
        setScientificListings(Array.isArray(scientificData) ? scientificData : []);
        setEntertainmentListings(Array.isArray(entertainmentData) ? entertainmentData : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchListings();
  }, []);



  return (
    <div className="bg-white text-black min-h-screen">

      {/* HERO */}
      <div className="relative h-[90vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          }}
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-white">

          <p className="text-red-500 tracking-[6px] font-bold text-sm mb-4">
            SPECIAL EVENT PLATFORM
          </p>

          <h1 className="text-5xl sm:text-7xl font-black leading-tight">
            WHERE EVENTS
            <br />
            BECOME <span className="text-red-600">EASIER TO FIND</span>
          </h1>

          <p className="text-gray-300 max-w-xl mt-5">
            Discover and manage events easily in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/search"
              className="bg-red-600 hover:bg-red-700 px-6 py-3 font-bold uppercase"
            >
              Search Event
            </Link>

            <Link
              to="/create-listing"
              className="border border-white px-6 py-3 uppercase hover:bg-white hover:text-black"
            >
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* SWIPER (ONLY UI CHANGED HERE) */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: true,
          }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          {(offerListings || []).map((listing) => (
            <SwiperSlide
              key={listing._id}
              className="!w-[80%] md:!w-[60%] lg:!w-[50%]"
            >
              <div
                className="h-[450px] bg-cover bg-center relative rounded-2xl overflow-hidden"
                style={{
                  backgroundImage: `url(${listing?.imageUrls?.[0]})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-xl font-bold">{listing.title}</h2>
                  <p className="text-sm text-gray-200">Featured Event</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SERVICES */}
      <div className="max-w-6xl mx-auto px-4 py-20 bg-white">

        <h2 className="text-2xl font-black border-l-4 border-red-600 pl-4 mb-10">
          PLATFORM SERVICES
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              title: "Event Booking",
              desc: "Book instantly",
              img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
            },
            {
              title: "Event Management",
              desc: "Manage events easily",
              img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
            },
            {
              title: "Live Experiences",
              desc: "Join anywhere",
              img: "https://images.unsplash.com/photo-1522199710521-72d69614c702",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-white border rounded-xl"
            >
              <img
                src={s.img}
                className="h-64 w-full object-cover hover:scale-110 transition"
              />

              <div className="absolute inset-0 bg-black/30"></div>

              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* LISTINGS */}
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {offerListings?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-red-500 mb-6">
              FEATURED OFFERS
            </h2>
            <div className="flex flex-wrap gap-5">
              {offerListings.map((l) => (
                <ListingItem key={l._id} listing={l} />
              ))}
            </div>
          </section>
        )}

      </div>

      <Footer />
    </div>
  );
}