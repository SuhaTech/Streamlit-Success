import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldX size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="bg-violet-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-violet-700 transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
