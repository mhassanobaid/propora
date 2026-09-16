import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// React Icons
import {
  FaShareAlt,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaTag,
  FaCheckCircle,
} from 'react-icons/fa';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Listing() {
  const { listingId } = useParams();

  // ================================
  // STATE
  // ================================

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Share button state
  const [copied, setCopied] = useState(false);

  // Track images that fail to load.
  // This allows the details to remain visible
  // even when placeholder URLs are broken.
  const [failedImages, setFailedImages] = useState([]);

  // ================================
  // FETCH LISTING
  // ================================

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`/api/v1/listings/${listingId}`);

        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(true);
          return;
        }

        // Your backend response:
        // { success: true, listing: {...} }
        setListing(data.listing);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // ================================
  // SHARE LISTING
  // ================================

  const handleShare = async () => {
    try {
      // Copy current listing URL.
      await navigator.clipboard.writeText(window.location.href);

      // Show success message.
      setCopied(true);

      // Hide success message after 2 seconds.
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // ================================
  // LOADING STATE
  // ================================

  if (loading) {
    return <p className="text-center my-10 text-xl">Loading listing...</p>;
  }

  // ================================
  // ERROR STATE
  // ================================

  if (error || !listing) {
    return (
      <p className="text-center my-10 text-xl text-red-600">
        Something went wrong!
      </p>
    );
  }

  // ================================
  // IMAGE HANDLING
  // ================================

  // Remove empty image URLs.
  const validImageUrls = Array.isArray(listing.imageUrls)
    ? listing.imageUrls.filter(
        (url) => typeof url === 'string' && url.trim() !== '',
      )
    : [];

  // Remove images that failed to load.
  const visibleImageUrls = validImageUrls.filter(
    (url) => !failedImages.includes(url),
  );

  // Called when an image cannot load.
  const handleImageError = (url) => {
    setFailedImages((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  // ================================
  // PRICE FORMATTING
  // ================================

  const regularPrice = Number(listing.regularPrice || 0);
  const discountPrice = Number(listing.discountPrice || 0);

  const formattedRegularPrice = regularPrice.toLocaleString('en-US');

  const formattedDiscountPrice = discountPrice.toLocaleString('en-US');

  // Calculate savings only for offers.
  const savings = regularPrice - discountPrice;

  // ================================
  // JSX
  // ================================

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
      {/* =================================
          SHARE BUTTON
          ================================= */}

      <div className="flex justify-end mb-4 relative">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share listing link"
          className="w-11 h-11 rounded-full border
                     flex items-center justify-center
                     bg-white shadow-sm
                     hover:bg-slate-100
                     transition"
        >
          <FaShareAlt className="text-slate-600 text-lg" />
        </button>

        {copied && (
          <p
            role="status"
            className="absolute right-0 top-14 z-10
                       bg-slate-800 text-white
                       text-sm px-3 py-2 rounded-lg
                       whitespace-nowrap shadow-md"
          >
            Link copied!
          </p>
        )}
      </div>

      {/* =================================
          IMAGE CAROUSEL
          ================================= */}

      {visibleImageUrls.length > 0 ? (
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            className="listing-swiper"
          >
            {visibleImageUrls.map((url, index) => (
              <SwiperSlide key={`${url}-${index}`}>
                <div className="h-[280px] sm:h-[400px] md:h-[500px] bg-slate-100">
                  <img
                    src={url}
                    alt={`${listing.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(url)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        // No valid or successfully loaded images.
        // Details below will still be displayed.
        <div
          className="h-48 sm:h-64 rounded-2xl
                     bg-slate-100 border
                     flex flex-col items-center justify-center
                     text-slate-500 gap-2"
        >
          <span className="text-3xl">🏠</span>
          <p className="text-sm">No images available</p>
        </div>
      )}

      {/* =================================
          LISTING DETAILS
          ================================= */}

      <div className="max-w-4xl mx-auto mt-7 flex flex-col gap-5">
        {/* Title + Price */}

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1
              className="text-2xl sm:text-3xl font-bold
                           text-slate-800 leading-tight"
            >
              {listing.name}
            </h1>

            <span
              className="text-xs font-semibold uppercase
                         tracking-wide bg-slate-100
                         text-slate-600 px-3 py-1.5
                         rounded-full"
            >
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>

          {/* Address */}

          <p
            className="flex items-start gap-2 mt-3
                        text-sm text-slate-500"
          >
            <FaMapMarkerAlt className="text-green-700 mt-0.5 shrink-0" />

            <span>{listing.address}</span>
          </p>
        </div>

        {/* =================================
            PRICE CARD
            ================================= */}

        <div className="rounded-xl border bg-white p-4 sm:p-5">
          <p
            className="text-xs uppercase tracking-wide
                        text-slate-500 font-semibold"
          >
            {listing.type === 'rent' ? 'Monthly Price' : 'Property Price'}
          </p>

          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <p
              className="text-3xl sm:text-4xl font-bold
                          text-slate-800"
            >
              ${listing.offer ? formattedDiscountPrice : formattedRegularPrice}
            </p>

            {listing.type === 'rent' && (
              <span className="text-sm text-slate-500">/ month</span>
            )}
          </div>

          {/* Show regular price and savings only with offer. */}

          {listing.offer && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-slate-400 line-through">
                ${formattedRegularPrice}
              </span>

              <span
                className="inline-flex items-center gap-1
                             text-sm font-semibold
                             text-green-700"
              >
                <FaTag />
                Save ${savings.toLocaleString('en-US')}
              </span>
            </div>
          )}
        </div>

        {/* =================================
            DESCRIPTION
            ================================= */}

        <section>
          <h2
            className="text-lg sm:text-xl font-semibold
                         text-slate-800 mb-2"
          >
            About this property
          </h2>

          <p className="text-slate-600 leading-7 text-sm sm:text-base">
            {listing.description}
          </p>
        </section>

        {/* =================================
            PROPERTY FEATURES
            ================================= */}

        <section>
          <h2
            className="text-lg sm:text-xl font-semibold
                         text-slate-800 mb-3"
          >
            Property features
          </h2>

          <div
            className="grid grid-cols-2 sm:grid-cols-4
                          gap-3"
          >
            {/* Bedrooms */}

            <div
              className="flex items-center gap-3
                            rounded-xl border p-3"
            >
              <FaBed className="text-green-700 text-xl shrink-0" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {listing.bedrooms}
                </p>

                <p className="text-xs text-slate-500">
                  {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </p>
              </div>
            </div>

            {/* Bathrooms */}

            <div
              className="flex items-center gap-3
                            rounded-xl border p-3"
            >
              <FaBath className="text-green-700 text-xl shrink-0" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {listing.bathrooms}
                </p>

                <p className="text-xs text-slate-500">
                  {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </p>
              </div>
            </div>

            {/* Parking */}

            <div
              className="flex items-center gap-3
                            rounded-xl border p-3"
            >
              <FaParking className="text-green-700 text-xl shrink-0" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {listing.parking ? 'Yes' : 'No'}
                </p>

                <p className="text-xs text-slate-500">Parking</p>
              </div>
            </div>

            {/* Furnished */}

            <div
              className="flex items-center gap-3
                            rounded-xl border p-3"
            >
              <FaChair className="text-green-700 text-xl shrink-0" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {listing.furnished ? 'Yes' : 'No'}
                </p>

                <p className="text-xs text-slate-500">Furnished</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            STATUS INFORMATION
            ================================= */}

        <div className="flex flex-wrap gap-3 pb-5">
          <span
            className="inline-flex items-center gap-2
                           bg-green-50 text-green-700
                           rounded-full px-3 py-2 text-sm"
          >
            <FaCheckCircle />
            Verified listing details
          </span>

          {listing.offer && (
            <span
              className="inline-flex items-center gap-2
                             bg-amber-50 text-amber-700
                             rounded-full px-3 py-2 text-sm"
            >
              <FaTag />
              Special offer
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
