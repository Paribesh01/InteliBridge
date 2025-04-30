"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

export default function ImprovedDebugSession() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 border m-4">
      <h1 className="text-xl font-bold">Session Debug</h1>
      
      <div className="mt-4">
        <p><strong>Status:</strong> {status}</p>
        
        {status === "authenticated" ? (
          <div className="mt-2">
            <p className="text-green-600">✓ Authenticated</p>
            
            <div className="mt-4">
              <h2 className="font-semibold">Session Data:</h2>
              <pre className="bg-gray-100 p-3 mt-1 overflow-auto max-h-96 text-xs">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <p><strong>Access Token Present:</strong> {session?.accessToken ? "✓ Yes" : "❌ No"}</p>
              
              {!session?.accessToken && (
                <div className="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded">
                  <p><strong>Issue Detected:</strong> The access token is missing from your session.</p>
                  <p className="mt-2">This is likely due to missing NextAuth callback configuration.</p>
                </div>
              )}
            </div>
          </div>
        ) : status === "loading" ? (
          <p>Loading session...</p>
        ) : (
          <div>
            <p className="text-red-600">Not authenticated</p>
            <button 
              onClick={() => signIn()} 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p><strong>Note:</strong> Make sure your NextAuth callbacks are properly configured to include the access token in the session.</p>
      </div>
    </div>
  );
}