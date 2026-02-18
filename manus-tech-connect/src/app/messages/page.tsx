"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';
import Link from 'next/link';

export default function MessagesListPage() {
  const router = useRouter();
  const session = getSession();
  
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user's connections with accepted status
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/connections');
        
        if (!response.ok) {
          throw new Error('Failed to fetch connections');
        }
        
        const data = ((await response.json()) as any) as any;
        
        // Filter only accepted connections
        const acceptedConnections = (data.connections || []).filter(
          (conn: any) => conn.status === 'accepted'
        );
        
        setConnections(acceptedConnections);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchConnections();
  }, [router, session]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Messages</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {connections.length === 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    No Messages
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                    <p>You don't have any active connections to message.</p>
                    <div className="mt-5">
                      <Link
                        href="/connections"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Connections
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {connections.map((connection) => (
                    <li key={connection.id}>
                      <Link
                        href={`/messages/${connection.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {connection.photo_url ? (
                                  <img
                                    className="h-12 w-12 rounded-full"
                                    src={connection.photo_url}
                                    alt={`${connection.first_name} ${connection.last_name}`}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-lg">
                                      {connection.first_name[0]}{connection.last_name[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-indigo-600">
                                  {connection.first_name} {connection.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {session?.role === 'teacher' ? 'Learner' : 'Teacher'}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm text-gray-500">
                                {connection.tech_name}
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                Connected on {formatDate(connection.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
