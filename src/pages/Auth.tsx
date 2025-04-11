
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <Layout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to STAR Story Forge</h1>
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Auth;
