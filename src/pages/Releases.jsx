import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Releases() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/music', { replace: true }); }, []);
  return null;
}