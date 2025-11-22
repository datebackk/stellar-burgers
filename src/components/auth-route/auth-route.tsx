import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { selectAccessToken } from '../../services/slices/userSlice/userSlice';
import { FC } from 'react';

export const AuthRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
