import {
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';
import { Link } from 'react-router-dom';

import type { Listing } from '../types/listing.types';

interface Landlord {
  username: string;
  email: string;
}

interface ContactProps {
  listing: Listing;
}

export default function Contact({ listing }: ContactProps) {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [message, setMessage] = useState('');

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(
          `/api/v1/users/${listing.userRef}`,
        );

        const data: Landlord = await res.json();

        setLandlord(data);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{' '}
            <span className="font-semibold">
              {landlord.username}
            </span>{' '}
            for{' '}
            <span className="font-semibold">
              {listing.name.toLowerCase()}
            </span>
          </p>

          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          />

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
