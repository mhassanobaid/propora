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
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

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
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

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
  // PRICE CALCULATIONS
  // ================================

  const regularPrice = Number(listing.regularPrice || 0);
  const discountPrice = Number(listing.discountPrice || 0);

  const hasOffer =
    listing.offer &&
    regularPrice > 0 &&
    discountPrice > 0 &&
    discountPrice < regularPrice;

  // Amount saved
  const savings = hasOffer ? regularPrice - discountPrice : 0;

  // Discount percentage
  const discountPercentage = hasOffer
    ? Math.round((savings / regularPrice) * 100)
    : 0;

  // Prices
  const formattedRegularPrice = regularPrice.toLocaleString('en-US');

  const formattedDiscountPrice = discountPrice.toLocaleString('en-US');

  const formattedSavings = savings.toLocaleString('en-US');

  // Payment label
  const paymentLabel =
    listing.type === 'rent' ? 'per month' : 'one-time payment';

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

        <section
          className="rounded-2xl border border-slate-200
             bg-white p-5 sm:p-6 shadow-sm"
        >
          {/* Card Header */}
          <div
            className="flex flex-wrap items-center
                  justify-between gap-3"
          >
            <div>
              <p
                className="text-xs font-semibold uppercase
                   tracking-wider text-slate-500"
              >
                {listing.type === 'rent' ? 'Monthly Rent' : 'Property Price'}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {listing.type === 'rent'
                  ? 'Rental payment'
                  : 'One-time property payment'}
              </p>
            </div>

            {/* Discount Badge */}
            {hasOffer && (
              <span
                className="inline-flex items-center gap-1
                   rounded-full bg-green-100
                   px-3 py-1.5 text-xs font-bold
                   text-green-700"
              >
                <FaTag />
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Final Price */}
          <div className="mt-5">
            <p className="text-xs font-medium text-slate-500">
              {hasOffer ? 'Price after discount' : 'Current price'}
            </p>

            <div
              className="flex flex-wrap items-baseline
                    gap-2 mt-1"
            >
              <p
                className={`text-3xl sm:text-4xl font-bold
                    tracking-tight ${
                      hasOffer ? 'text-green-700' : 'text-slate-800'
                    }`}
              >
                ${hasOffer ? formattedDiscountPrice : formattedRegularPrice}
              </p>

              {listing.type === 'rent' && (
                <span className="text-sm text-slate-500">/ month</span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {hasOffer
                ? listing.type === 'rent'
                  ? 'Final monthly rent'
                  : 'Final property price'
                : paymentLabel}
            </p>
          </div>

          {/* Offer Breakdown */}
          {hasOffer && (
            <div
              className="mt-5 pt-4 border-t
                 border-slate-100 space-y-4"
            >
              {/* Original Price */}
              <div
                className="flex items-center
                   justify-between gap-3"
              >
                <span className="text-sm text-slate-500">Regular price</span>

                <span
                  className="text-sm text-slate-400
                     line-through"
                >
                  ${formattedRegularPrice}
                  {listing.type === 'rent' && (
                    <span className="no-underline"> / month</span>
                  )}
                </span>
              </div>

              {/* Savings Amount */}
              <div
                className="flex items-center
                   justify-between gap-3"
              >
                <span className="text-sm text-slate-500">You save</span>

                <span
                  className="text-sm font-semibold
                     text-green-700"
                >
                  ${formattedSavings}
                </span>
              </div>

              {/* Discount Percentage */}
              <div
                className="flex items-center
                   justify-between gap-3"
              >
                <span className="text-sm text-slate-500">Owner's discount</span>

                <span
                  className="text-sm font-bold
                     text-green-700"
                >
                  {discountPercentage}% off
                </span>
              </div>

              {/* Final Price Summary */}
              <div
                className="rounded-xl border
                   border-green-100
                   bg-green-50 p-4"
              >
                <div
                  className="flex flex-wrap items-center
                     justify-between gap-2"
                >
                  <span
                    className="text-sm font-semibold
                       text-green-800"
                  >
                    Your payable price
                  </span>

                  <span
                    className="text-lg sm:text-xl
                       font-bold text-green-700"
                  >
                    ${formattedDiscountPrice}
                  </span>
                </div>

                <p className="text-xs text-green-700 mt-2">
                  {listing.type === 'rent'
                    ? 'Amount payable every month'
                    : 'Amount payable for the property'}
                </p>
              </div>

              {/* Negotiation Hint */}
              <p className="text-xs leading-5 text-slate-500">
                This is the owner's current offer. You may discuss additional
                discounts with the owner after contacting them.
              </p>
            </div>
          )}

          {/* No Offer */}
          {!hasOffer && (
            <div
              className="mt-4 rounded-lg
                 bg-slate-50 p-3"
            >
              <p className="text-xs text-slate-500">
                No discount currently offered by the owner.
              </p>
            </div>
          )}
        </section>

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

        <div className="flex flex-col gap-3 pb-5">
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
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}
              className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
            >
              Contact landlord
            </button>
          )}
          {contact && <Contact listing={listing} />}
        </div>
      </div>
    </main>
  );
}
