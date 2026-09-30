import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Listing } from '../types/listing.types';

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

interface ExistingImage {
  url: string;
  publicId: string | null;
}

interface NewImage {
  file: File;
  preview: string;
}

interface ListingResponse {
  success: boolean;
  message?: string;
  listing?: Listing;
}

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams<{ listingId: string }>();

  const [files, setFiles] = useState<NewImage[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  const [formData, setFormData] = useState<ListingFormData>({
    name: '',
    description: '',
    address: '',
    type: ListingType.Rent,
    bedrooms: '1',
    bathrooms: '1',
    regularPrice: '50',
    discountPrice: '0',
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
    const fetchListing = async () => {
      if (!params.listingId) {
        setError('Listing ID is missing');
        return;
      }

      try {
        const res = await fetch(
          `/api/v1/listings/${params.listingId}`,
          {
            credentials: 'include',
          },
        );

        const data: ListingResponse = await res.json();

        if (!data.success || !data.listing) {
          setError(data.message ?? 'Failed to fetch listing');
          return;
        }

        const listing = data.listing;

        setFormData({
          name: listing.name,
          description: listing.description,
          address: listing.address,
          type: listing.type,
          bedrooms: String(listing.bedrooms),
          bathrooms: String(listing.bathrooms),
          regularPrice: String(listing.regularPrice),
          discountPrice: String(listing.discountPrice ?? 0),
          offer: listing.offer,
          parking: listing.parking,
          furnished: listing.furnished,
        });

        setExistingImages(
          listing.imageUrls.map((url, index) => ({
            url,
            publicId: listing.imagePublicIds?.[index] ?? null,
          })),
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleRemoveNewImage = (index: number) => {
    setFiles((prev) => {
      const image = prev[index];

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value, type } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: id as ListingType,
      }));

      return;
    }

    if (
      id === 'parking' ||
      id === 'furnished' ||
      id === 'offer'
    ) {
      setFormData((prev) => ({
        ...prev,
        [id]: (e.target as HTMLInputElement).checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!params.listingId) {
      setError('Listing ID is missing');
      return;
    }

    if (existingImages.length + files.length < 1) {
      setError('You must have at least one image');
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setError(
        'Discount price must be lower than regular price',
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const dataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, String(value));
      });

      dataToSend.append(
        'existingImages',
        JSON.stringify(existingImages),
      );

      files.forEach(({ file }) => {
        dataToSend.append('images', file);
      });

      const res = await fetch(
        `/api/v1/listings/${params.listingId}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: dataToSend,
        },
      );

      const data: ListingResponse = await res.json();

      if (!data.success || !data.listing) {
        setError(data.message ?? 'Failed to update listing');
        return;
      }

      navigate(`/listing/${data.listing._id}`);
    } catch (err: unknown) {
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
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">{paymentLabel}</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">{paymentLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
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

                console.log('selectedFiles', selectedFiles);

                console.log('files', files);

                console.log('existingImages', existingImages);

                if (
                  existingImages.length + files.length + selectedFiles.length >
                  6
                ) {
                  setImageUploadError('You can only have 6 images per listing');
                  return;
                }

                if (selectedFiles.some((file) => file.size > 2 * 1024 * 1024)) {
                  setImageUploadError('Each image must be smaller than 2 MB');
                  return;
                }

                const filesWithPreview = selectedFiles.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }));

                console.log('filesWithPreview', filesWithPreview);

                setFiles((prev) => [...prev, ...filesWithPreview]);
                console.log('files.length', files.length);

                setImageUploadError('');

                // Allow selecting the same file again
                e.target.value = '';
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <p className="text-sm text-gray-600">
              Select up to 6 images. They will be uploaded when you create the
              listing.
            </p>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {existingImages.length > 0 &&
            existingImages.map((image, index) => (
              <div
                key={image.publicId || image.url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={image.url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                {index === 0 && (
                  <span className="text-sm font-semibold">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          {files.length > 0 &&
            files.map(({ preview, file }, index) => (
              <div
                key={preview}
                className="flex justify-between p-3 border items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={preview}
                    alt={`new listing image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex flex-col">
                    {existingImages.length === 0 && index === 0 && (
                      <span className="text-sm font-semibold">Cover</span>
                    )}

                    <span className="text-xs text-gray-500">{file.name}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating...' : 'Update listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
