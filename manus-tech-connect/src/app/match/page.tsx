"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function MatchingPage() {
  const router = useRouter();
  const session = getSession();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.role !== 'learner') {
      // Only learners can use the matching feature
      router.push('/dashboard');
      return;
    }
    
    setIsLoading(false);
  }, [router, session]);
  
  const handleFindMatch = async () => {
    setError('');
    setSuccessMessage('');
    setIsMatching(true);
    
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to find a match');
      }
      
      if (data.match) {
        setMatchResult(data.match);
        setSuccessMessage('We found a teacher for you!');
      } else {
        setMatchResult(null);
        setError('No matching teachers found at this time. Please try again later or adjust your technology preferences and availability.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsMatching(false);
    }
  };
  
  const handleConnect = async () => {
    if (!matchResult) return;
    
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: matchResult.teacher_id,
          technology_id: matchResult.technology_id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          // Connection already exists
          router.push('/connections');
          return;
        }
        throw new Error(data.error || 'Failed to connect with teacher');
      }
      
      // Redirect to connections page
      router.push('/connections');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find a Match</h1>
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
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Automatic Teacher Matching
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Our system will automatically match you with a teacher based on your technology preferences and availability.
                  </p>
                  <p className="mt-1">
                    Make sure you've set up your technology preferences and availability before using this feature.
                  </p>
                </div>
                
                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-4">
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
                  <div className="mt-4 rounded-md bg-green-50 p-4">
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
                
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleFindMatch}
                    disabled={isMatching}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isMatching ? 'Finding a match...' : 'Find a Teacher Match'}
                  </button>
                </div>
                
                {matchResult && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900">Match Found!</h4>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {matchResult.teacher_photo ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={matchResult.teacher_photo}
                            alt={`${matchResult.teacher_first_name} ${matchResult.teacher_last_name}`}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-lg">
                              {matchResult.teacher_first_name[0]}{matchResult.teacher_last_name[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {matchResult.teacher_first_name} {matchResult.teacher_last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Teacher
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Technology:</span> {matchResult.technology_name}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Proficiency:</span> {matchResult.proficiency_level}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Matching Availability:</span> {matchResult.matching_days.join(', ')}
                      </p>
                    </div>
                    
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={handleConnect}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Connect with this Teacher
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
