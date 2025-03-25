"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';
import Link from 'next/link';

export default function ConnectionsPage() {
  const router = useRouter();
  const session = getSession();
  
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user's connections
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/connections');
        
        if (!response.ok) {
          throw new Error('Failed to fetch connections');
        }
        
        const data = await response.json();
        setConnections(data.connections || []);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchConnections();
  }, [router, session]);
  
  const handleUpdateStatus = async (connectionId: number, status: string) => {
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/connections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connection_id: connectionId,
          status
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update connection');
      }
      
      // Update local state
      setConnections(connections.map(conn => 
        conn.id === connectionId ? { ...conn, status } : conn
      ));
      
      setSuccessMessage(`Connection ${status} successfully`);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading connections...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Connections</h1>
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
            
            {successMessage && (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{successMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {connections.length === 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    No Connections Found
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                    <p>You don't have any connections yet.</p>
                    {session?.role === 'learner' ? (
                      <div className="mt-5">
                        <Link
                          href="/find-teachers"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Find Teachers
                        </Link>
                      </div>
                    ) : (
                      <p className="mt-2">Wait for learners to connect with you.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {connections.map((connection) => (
                    <li key={connection.id} className="p-4 sm:p-6">
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
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                              {connection.first_name} {connection.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {session?.role === 'teacher' ? 'Learner' : 'Teacher'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(connection.status)}`}>
                            {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Technology:</span>
                          <span className="ml-2">{connection.tech_name}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Connected on:</span>
                          <span className="ml-2">
                            {new Date(connection.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
                        {connection.status === 'pending' && session?.role === 'teacher' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(connection.id, 'accepted')}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(connection.id, 'rejected')}
                              className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {connection.status === 'accepted' && (
                          <Link
                            href={`/messages/${connection.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Message
                          </Link>
                        )}
                        
                        {connection.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(connection.id, 'completed')}
                            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
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
