"use client";

import { useActionState } from "react";
import { adminLogin } from "../actions";

const initialState = { error: "" };

export default function AdminLogin() {
  const [state, formAction] = useActionState(adminLogin, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Login</h1>
        
        <form action={formAction} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input 
              name="username" 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm font-semibold text-center">{state.error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors mt-4"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}