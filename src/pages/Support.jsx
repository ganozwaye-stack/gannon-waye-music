import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/back-this', { replace: true }); }, []);
  return null;
}