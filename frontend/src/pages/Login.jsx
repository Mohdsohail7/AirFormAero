import React from "react";
import { loginWithAirtable } from "../utils/api";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to AirFormAero
        </h1>
        <p className="mb-8 text-gray-600">
          Log in with your Airtable account to start building forms.
        </p>
        <button
          onClick={loginWithAirtable}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition w-full"
        >
          Login with Airtable
        </button>
      </div>
    </div>
  );
}
