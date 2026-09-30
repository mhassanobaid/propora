import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ListingItem from '../components/ListingItem';
import type { Listing } from '../types/listing.types';

type ListingSearchType = 'all' | 'rent' | 'sale';
type SortField = 'created_at' | 'regularPrice' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface SidebarData {
  searchTerm: string;
  type: ListingSearchType;
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  sort: SortField;
  order: SortOrder;
}

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState<SidebarData>({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      const type: ListingSearchType =
        typeFromUrl === 'rent' || typeFromUrl === 'sale'
          ? typeFromUrl
          : 'all';

      const sort: SortField =
        sortFromUrl === 'regularPrice' ||
        sortFromUrl === 'createdAt' ||
        sortFromUrl === 'created_at'
          ? sortFromUrl
          : 'created_at';

      const order: SortOrder =
        orderFromUrl === 'asc' ? 'asc' : 'desc';

      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type,
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort,
        order,
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        const searchQuery = urlParams.toString();

        const res = await fetch(
          `/api/v1/listings/index?${searchQuery}`,
        );

        const data: Listing[] = await res.json();

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

        setListings(data);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;

    if (
      id === 'all' ||
      id === 'rent' ||
      id === 'sale'
    ) {
      setSidebardata((prev) => ({
        ...prev,
        type: id,
      }));

      return;
    }

    if (id === 'searchTerm') {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: value,
      }));

      return;
    }

    if (
      id === 'parking' ||
      id === 'furnished' ||
      id === 'offer'
    ) {
      const checked = (e.target as HTMLInputElement).checked;

      setSidebardata((prev) => ({
        ...prev,
        [id]: checked,
      }));

      return;
    }

    if (id === 'sort_order') {
      const [sort = 'created_at', order = 'desc'] =
        value.split('_');

      setSidebardata((prev) => ({
        ...prev,
        sort: sort as SortField,
        order: order as SortOrder,
      }));
    }
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set(
      'searchTerm',
      sidebardata.searchTerm,
    );

    urlParams.set('type', sidebardata.type);

    urlParams.set(
      'parking',
      String(sidebardata.parking),
    );

    urlParams.set(
      'furnished',
      String(sidebardata.furnished),
    );

    urlParams.set(
      'offer',
      String(sidebardata.offer),
    );

    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;

    const urlParams = new URLSearchParams(
      location.search,
    );

    urlParams.set(
      'startIndex',
      String(startIndex),
    );

    const searchQuery = urlParams.toString();

    const res = await fetch(
      `/api/v1/listings/index?${searchQuery}`,
    );

    const data: Listing[] = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    }

    setListings((prev) => [...prev, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r md:min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>

            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">
              Type:
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">
              Amenities:
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">
              Sort:
            </label>

            <select
              onChange={handleChange}
              defaultValue="createdAt_desc"
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">
                Price high to low
              </option>

              <option value="regularPrice_asc">
                Price low to hight
              </option>

              <option value="createdAt_desc">
                Latest
              </option>

              <option value="createdAt_asc">
                Oldest
              </option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">
              No listing found!
            </p>
          )}

          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
              />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}