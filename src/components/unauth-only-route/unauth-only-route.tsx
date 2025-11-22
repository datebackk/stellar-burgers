import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectAccessToken } from '../../services/slices/userSlice/userSlice';
import { Navigate } from 'react-router-dom';

export const UnAuthOnlyRoute: FC<{ children: JSX.Element }> = ({
  children
}) => {
  const accessToken = useSelector(selectAccessToken);

  if (accessToken) {
    return <Navigate to='/' replace />;
  }

  return children;
};
