import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SignUpResponse {
  success: boolean;
  message?: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: SignUpResponse = await res.json();

      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message ?? 'Signup failed');
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong',
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {error && <p className="text-red-500 mt-5">{error}</p>}

      <h1 className="text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>

        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
