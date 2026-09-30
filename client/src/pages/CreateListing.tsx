import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ListingType } from '../types/listing.types';

interface ListingFormData {
  name: string;
  description: string;
  address: string;
  type: ListingType;
  bedrooms: string;
  bathrooms: string;
  regularPrice: string;
  discountPrice: string;
  offer: boolean;
  parking: boolean;
  furnished: boolean;
}

interface ImageFile {
  file: File;
  preview: string;
}

interface CreateListingResponse {
  success: boolean;
  message?: string;
  listing?: {
    _id: string;
  };
}

export default function CreateListing() {
  const navigate = useNavigate();

  const [files, setFiles] = useState<ImageFile[]>([]);

  const [formData, setFormData] = useState<ListingFormData>({
    name: '',
    description: '',
    address: '',
    type: ListingType.Sale,
    bedrooms: '',
    bathrooms: '',
    regularPrice: '',
    discountPrice: '',
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentLabel =
    formData.type === 'rent'
      ? '$ / month'
      : '$ one-time payment';

  useEffect(() => {
    return () => {
      files.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [files]);

  // --------------------------------------------------
  // Generic form handler
  // --------------------------------------------------

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    const { id, value, type } = e.target;

		setFormData((prev) => ({
			...prev,
			[id]: type === 'checkbox'
				? (e.target as HTMLInputElement).checked
				: value,
		}));
  };

  // --------------------------------------------------
  // Remove image
  // --------------------------------------------------

  const handleRemoveImage = (index: number) => {
    setFiles((prev) => {
      const fileToRemove = prev[index];

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // --------------------------------------------------
  // Create listing
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError('');
      setImageUploadError('');

      // Validate images
      if (files.length === 0) {
        setError('Please select at least one image');
        return;
      }

      if (files.length > 6) {
        setError('You can only upload 6 images per listing');
        return;
      }

      const hasLargeFile = files.some(
        ({ file }) => file.size > 2 * 1024 * 1024,
      );

      if (hasLargeFile) {
        setError('Each image must be smaller than 2 MB');
        return;
      }

      // Validate discount price
      if (
        formData.offer &&
        Number(formData.discountPrice) >
          Number(formData.regularPrice)
      ) {
        setError(
          'Discount price cannot be greater than regular price',
        );
        return;
      }

      setLoading(true);

      // Create multipart form data
      const listingFormData = new FormData();

      // Add text and boolean fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'discountPrice' && !formData.offer) {
          return;
        }

        // FormData.append expects string/blob.
        // String() preserves the original form submission behavior.
        listingFormData.append(key, String(value));
      });

      // Add images
      files.forEach(({ file }) => {
        listingFormData.append('images', file);
      });

      const res = await fetch('/api/v1/listings/create', {
        method: 'POST',
        credentials: 'include',
        body: listingFormData,
      });

      const data: CreateListingResponse = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || 'Failed to create listing');
        return;
      }

      console.log('Listing created:', data);

      if (!data.listing?._id) {
        setError('Listing was created but ID was not returned');
        return;
      }

      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            name="name"
            minLength={3}
            maxLength={100}
            required
            onChange={handleChange}
            value={formData.name}
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            name="description"
            minLength={10}
            maxLength={2000}
            rows={6}
            required
            onChange={handleChange}
            value={formData.description}
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            name="address"
            maxLength={300}
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Type + Features */}
          <div className="flex gap-6 flex-wrap">
            {/* Sale */}
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                value="sale"
                className="w-5"
                checked={formData.type === 'sale'}
                onChange={() =>
									setFormData((prev) => ({
										...prev,
										type: ListingType.Sale,
									}))
								}
              />

              <label htmlFor="sale">Sell</label>
            </div>

            {/* Rent */}
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                value="rent"
                className="w-5"
                checked={formData.type === 'rent'}
                onChange={() =>
									setFormData((prev) => ({
										...prev,
  									type: ListingType.Rent,
									}))
								}
              />

              <label htmlFor="rent">Rent</label>
            </div>

            {/* Parking */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />

              <label htmlFor="parking">Parking spot</label>
            </div>

            {/* Furnished */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                name="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />

              <label htmlFor="furnished">Furnished</label>
            </div>

            {/* Offer */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                name="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />

              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          {/* Numbers + Prices */}
          <div className="flex flex-wrap gap-6">
            {/* Bedrooms */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />

              <label htmlFor="bedrooms">Beds</label>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />

              <label htmlFor="bathrooms">Baths</label>
            </div>

            {/* Regular Price */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center">
                <label htmlFor="regularPrice">Regular price</label>

                <span className="text-xs">{paymentLabel}</span>
              </div>
            </div>

            {/* Discount Price */}
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  min={0}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />

                <div className="flex flex-col items-center">
                  <label htmlFor="discountPrice">Discounted price</label>

                  <span className="text-xs">{paymentLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 gap-4">
          {/* Images */}
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);

                if (files.length + selectedFiles.length > 6) {
                  setImageUploadError('You can only select up to 6 images');
                  return;
                }

                const filesWithPreview = selectedFiles.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }));

                setFiles((prev) => [...prev, ...filesWithPreview]);
                setImageUploadError('');

                // Allow selecting the same file again if needed
                e.target.value = '';
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
            />

            <p className="text-sm text-gray-600">
              Select up to 6 images. They will be uploaded when you create the
              listing.
            </p>
          </div>

          {/* Image error */}
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          {/* Uploaded images */}
          {files.length > 0 &&
            files.map(({ preview, file }, index) => (
              <div
                key={preview}
                className="flex justify-between p-3 border items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={preview}
                    alt={`listing image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex flex-col">
                    {index === 0 && (
                      <span className="text-sm font-semibold">Cover</span>
                    )}

                    <span className="text-xs text-gray-500">{file.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          {/* Create Listing */}
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>

          {/* General error */}
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
