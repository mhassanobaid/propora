import React from 'react';

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-4">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">

          {/* Name */}
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            minLength={3}
            maxLength={100}
            required
          />

          {/* Description */}
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            minLength={10}
            maxLength={2000}
            rows={6}
            required
          />

          {/* Address */}
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            maxLength={300}
            required
          />

          {/* Listing type + features */}
          <div className="flex gap-6 flex-wrap">

            {/* Type: SALE */}
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                value="sale"
                defaultChecked
                className="w-5"
                required
              />
              <label htmlFor="sale">Sell</label>
            </div>

            {/* Type: RENT */}
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                value="rent"
                className="w-5"
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
              />
              <label htmlFor="offer">Offer</label>
            </div>

          </div>

          {/* Property numbers + pricing */}
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
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>

            {/* Regular price */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />

              <div className="flex flex-col items-center">
                <label htmlFor="regularPrice">
                  Regular price
                </label>

                <span className="text-xs">
                  ($ / month)
                </span>
              </div>
            </div>

            {/* Discount price */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                min={0}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />

              <div className="flex flex-col items-center">
                <label htmlFor="discountPrice">
                  Discounted price
                </label>

                <span className="text-xs">
                  ($ / month)
                </span>
              </div>
            </div>

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
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              required
            />

            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>

          </div>

          {/* Create */}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>

        </div>

      </form>
    </main>
  );
}