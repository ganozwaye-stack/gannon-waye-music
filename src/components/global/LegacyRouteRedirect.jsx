import { Navigate, useLocation } from 'react-router-dom';

export default function LegacyRouteRedirect({ to }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
}
