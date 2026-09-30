import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

interface GoogleAuthResponse {
  user?: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  message?: string;
}

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Creating popup
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();

      // Send Firebase token to your backend
      const res = await fetch('/api/v1/google', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data: GoogleAuthResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Google authentication failed',
        );
      }

      // Store your application's authenticated user
      if (!data.user) {
        throw new Error('User data was not returned');
      }

      dispatch(signInSuccess(data.user));

      navigate('/');
    } catch (error) {
      console.log(
        'Could not sign in with Google:',
        error instanceof Error
          ? error.message
          : 'Unknown error',
      );
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}