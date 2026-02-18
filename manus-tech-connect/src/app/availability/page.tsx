"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function AvailabilityPage() {
  const router = useRouter();
  const session = getSession();
  
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    day_of_week: '0',
    start_time: '09:00',
    end_time: '17:00'
  });
  const [isAdding, setIsAdding] = useState(false);
  
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user's availability
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = ((await response.json()) as any) as any;
        
        setAvailabilities(data.availability || []);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router, session]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate times
    if (formData.start_time >= formData.end_time) {
      setError('Start time must be before end time');
      return;
    }
    
    setIsAdding(true);
    
    try {
      const response = await fetch('/api/profile/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day_of_week: parseInt(formData.day_of_week),
          start_time: formData.start_time,
          end_time: formData.end_time
        }),
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add availability');
      }
      
      // Refresh data
      const profileResponse = await fetch('/api/profile');
      const profileData = (await profileResponse.json()) as any;
      
      setAvailabilities(profileData.availability || []);
      setSuccessMessage('Availability added successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleRemoveAvailability = async (dayOfWeek: number) => {
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`/api/profile/availability?day_of_week=${dayOfWeek}`, {
        method: 'DELETE',
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove availability');
      }
      
      // Update local state
      setAvailabilities(availabilities.filter(avail => avail.day_of_week !== dayOfWeek));
      setSuccessMessage('Availability removed successfully');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Availability</h1>
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
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Set Your Availability
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {session?.role === 'teacher' 
                        ? 'Set the times when you are available to teach.'
                        : 'Set the times when you are available to learn.'}
                    </p>
                  </div>
                  
                  {/* Current availability */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Your Current Availability</h4>
                    {availabilities.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-500">
                        You haven't set any availability yet.
                      </p>
                    ) : (
                      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {availabilities.map((avail) => (
                          <li key={avail.day_of_week} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                            <div className="w-full flex items-center justify-between p-6 space-x-6">
                              <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-gray-900 text-sm font-medium truncate">
                                    {dayNames[avail.day_of_week]}
                                  </h3>
                                </div>
                                <p className="mt-1 text-gray-500 text-sm truncate">
                                  {avail.start_time} - {avail.end_time}
                                </p>
                              </div>
                            </div>
                            <div>
                              <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="w-0 flex-1 flex">
                                  <button
                                    onClick={() => handleRemoveAvailability(avail.day_of_week)}
                                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-bl-lg hover:text-red-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Add new availability */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Add Availability</h4>
                    <form onSubmit={handleAddAvailability} className="space-y-4">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                          <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">
                            Day of Week
                          </label>
                          <div className="mt-1">
                            <select
                              id="day_of_week"
                              name="day_of_week"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={formData.day_of_week}
                              onChange={handleChange}
                              required
                            >
                              {dayNames.map((day, index) => (
                                <option key={index} value={index}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                            Start Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              id="start_time"
                              name="start_time"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={formData.start_time}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              id="end_time"
                              name="end_time"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={formData.end_time}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isAdding}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                          >
                            {isAdding ? 'Adding...' : 'Add Availability'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
