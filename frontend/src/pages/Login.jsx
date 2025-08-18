import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/airtable`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Login with Airtable
      </button>
    </div>
  );
};

export default Login;
