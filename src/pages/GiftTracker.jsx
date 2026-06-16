import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GiftTracker() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/gift-checklist', { replace: true }); }, []);
  return null;
}