import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import type { RootState } from '../app/store';

export default function PrivateRoute() {
  const { currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}