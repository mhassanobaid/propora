import { useState } from 'react';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'sale',
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

  // --------------------------------------------------
  // Generic form handler
  // --------------------------------------------------

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  // --------------------------------------------------
  // Temporary image upload
  // --------------------------------------------------

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setImageUploadError('Please select at least one image');
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }

    // 2 MB per image
    const hasLargeFile = files.some((file) => file.size > 2 * 1024 * 1024);

    if (hasLargeFile) {
      setImageUploadError('Each image must be smaller than 2 MB');
      return;
    }

    try {
      setUploading(true);
      setImageUploadError('');

      /*
      ==================================================
      FUTURE FIREBASE IMPLEMENTATION
      ==================================================

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      const urls = await Promise.all(promises);

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));

      ==================================================
      */

      // -----------------------------------------------
      // TEMPORARY IMPLEMENTATION
      // -----------------------------------------------

      // Dummy URL because Firebase is not configured yet.
      // This allows your backend model's imageUrls
      // validation to pass.

      const dummyUrls = files.map(() => 'https://placehold.co/600x400');

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...dummyUrls],
      }));

      setFiles([]);
    } catch (err) {
      setImageUploadError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  /*
  ==================================================
  FUTURE FIREBASE FUNCTION
  ==================================================

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const fileName =
        new Date().getTime() + '-' + file.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(
        storageRef,
        file
      );

      uploadTask.on(
        'state_changed',

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred /
              snapshot.totalBytes) *
            100;

          console.log(
            `Upload is ${progress}% done`
          );
        },

        (error) => {
          reject(error);
        },

        async () => {
          const downloadURL =
            await getDownloadURL(
              uploadTask.snapshot.ref
            );

          resolve(downloadURL);
        }
      );
    });
  };

  ==================================================
  */

  // --------------------------------------------------
  // Remove image
  // --------------------------------------------------

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // --------------------------------------------------
  // Create listing
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      // Model requires at least one image
      if (formData.imageUrls.length < 1) {
        setError('You must upload at least one image');
        return;
      }

      // Model validation:
      // discountPrice <= regularPrice
      if (Number(formData.discountPrice) > Number(formData.regularPrice)) {
        setError('Discount price cannot be greater than regular price');
        return;
      }

      setLoading(true);

      const listingData = {
        ...formData,

        // Convert HTML input strings into numbers
        regularPrice: Number(formData.regularPrice),
        discountPrice: formData.offer
          ? Number(formData.discountPrice)
          : undefined,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      };

      const res = await fetch('/api/v1/listings/create', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(listingData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || 'Failed to create listing');
        return;
      }

      console.log('Listing created:', data);

      /*
        Your controller returns:

        {
          success: true,
          message: "...",
          listing: {...}
        }

        Therefore:
      */

      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
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

                <span className="text-xs">($ / month)</span>
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

                  <span className="text-xs">($ / month)</span>
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
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {/* Image error */}
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          {/* Uploaded images */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="flex justify-between p-3 border items-center"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={url}
                    alt={`listing image ${index + 1}`}
                    className="w-20 h-20 object-contain rounded-lg"
                  />

                  {index === 0 && (
                    <span className="text-sm font-semibold">Cover</span>
                  )}
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
            disabled={loading || uploading}
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
