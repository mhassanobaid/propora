import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import type {
  ChangeEvent,
  FormEvent,
} from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearError,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../features/user/userSlice';
import { Link } from 'react-router-dom';
import type { Listing } from '../types/listing.types';
import type { ApiResponse } from '../types/api.types';

interface ProfileFormData {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export default function Profile() {
	const fileRef = useRef<HTMLInputElement | null>(null);
  const { currentUser, error, loading } = useSelector(
    (state: RootState) => state.user
	);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [formData, setFormData] = useState<ProfileFormData>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState<Listing[]>([]);
	const [showNoListingsToast, setShowNoListingsToast] = useState(false);
  const dispatch = useDispatch();
	if (!currentUser) {
		return <div>Loading...</div>;
	}

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (updateSuccess || error) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
        dispatch(clearError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, error, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			dispatch(updateUserStart());

			const profileFormData = new FormData();

			if (formData.username) {
				profileFormData.append('username', formData.username);
			}

			if (formData.email) {
				profileFormData.append('email', formData.email);
			}

			if (formData.password) {
				profileFormData.append('password', formData.password);
			}

			if (file) {
				profileFormData.append('avatar', file);
			}

			const res = await fetch(
				`/api/v1/users/update/${currentUser._id}`,
				{
					method: 'PUT',
					credentials: 'include',
					body: profileFormData,
				},
			);

			const data = await res.json();

			if (!res.ok || data.success === false) {
				dispatch(
					updateUserFailure(
						data.message || 'Failed to update profile',
					),
				);
				return;
			}

			dispatch(updateUserSuccess(data.user));
			setUpdateSuccess(true);
			setFile(undefined);
		} catch (error) {
			dispatch(
				updateUserFailure(
					error instanceof Error
						? error.message
						: 'Something went wrong',
				),
			);
		}
	};

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<never> = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
			dispatch(
				updateUserFailure(
					error instanceof Error ? error.message : 'Something went wrong',
				),
			);
		}
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/v1/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
			dispatch(
				signOutUserFailure(
					error instanceof Error ? error.message : 'Something went wrong',
				),
			);
		}
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(`/api/v1/users/${currentUser._id}/listings`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data.listings);

			if (data.listings.length === 0) {
				setShowNoListingsToast(true);

				setTimeout(() => {
					setShowNoListingsToast(false);
				}, 3000);
			}
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId: string) => {
    try {
      const res = await fetch(`/api/v1/listings/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
			console.log(
				error instanceof Error ? error.message : 'Something went wrong',
			);
		}
  };

	const avatarPreview = file
  ? URL.createObjectURL(file)
  : currentUser.avatar;

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
						const selectedFile = e.target.files?.[0];

						if (selectedFile) {
							setFile(selectedFile);
						}
					}}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
					onClick={() => fileRef.current?.click()}
          src={avatarPreview}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-red-700 mt-5 text-center">{error ? error : ''}</p>
        <p className="text-green-700 mt-5 text-center">
          {updateSuccess ? 'User is updated successfully!' : ''}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
			
			{showNoListingsToast && ( <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-xl"> <div className="flex items-center gap-3"> <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600"> ! </span> <p> You don't have any listings yet.{' '} <Link to="/create-listing" className="font-semibold text-green-700 hover:text-green-800 hover:underline" > Create one </Link>{' '} to see it here. </p> </div> </div> )}

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
