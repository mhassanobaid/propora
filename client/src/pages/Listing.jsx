import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

// Enable Swiper navigation
SwiperCore.use([Navigation]);

export default function Listing() {
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

        // If your backend returns { listing: {...} }
        // this stores the listing object.
        // If it returns the listing directly, data is used.
        setListing(data.listing);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(true);
      } finally {
        // Always stop loading after success or failure.
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Loading state
  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  // Error state
  if (error || !listing) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  // Keep only non-empty string image URLs.
  // Invalid/missing URLs are excluded from the gallery.
  const validImageUrls = Array.isArray(listing.imageUrls)
    ? listing.imageUrls.filter(
        (url) => typeof url === 'string' && url.trim() !== '',
      )
    : [];

  console.log('validImageUrls', validImageUrls);

  return (
    <main className="max-w-6xl mx-auto p-3">
      {/* ================================
          IMAGES SECTION
          Render only if valid URLs exist.
          ================================ */}
      {validImageUrls.length > 0 && (
        <Swiper navigation>
          {validImageUrls.map((url, index) => (
            <SwiperSlide key={`${url}-${index}`}>
              <div
                className="h-[550px]"
                style={{
                  background: `url("${url}") center no-repeat`,
                  backgroundSize: 'cover',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Display this when no images are available.
          The rest of the listing still renders. */}
      {validImageUrls.length === 0 && (
        <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">No images available</p>
        </div>
      )}

      {/* ================================
          LISTING DETAILS
          Independent of the image gallery.
          ================================ */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold">{listing.name}</h1>

        <p className="text-slate-600 mt-2">📍 {listing.address}</p>

        <p className="mt-4 text-gray-700">{listing.description}</p>
      </div>
    </main>
  );
}
