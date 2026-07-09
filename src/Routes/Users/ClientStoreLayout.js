import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

const PartyLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('PARTY_TOKEN');
    const projectId = localStorage.getItem('PARTY_PROJECT_ID');

    if (!token) {
      toast.error('Session expired. Please login again.');
      localStorage.clear();
      navigate('/');
      return;
    }

    if (!projectId) {
      toast.error('No project assigned to this party.');
      localStorage.clear();
      navigate('/');
      return;
    }
  }, [navigate]);

  return <Outlet />;
};

export default PartyLayout;
