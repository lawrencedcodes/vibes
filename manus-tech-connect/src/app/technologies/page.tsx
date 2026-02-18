"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function TechnologiesPage() {
  const router = useRouter();
  const session = getSession();
  
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [userTechnologies, setUserTechnologies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [selectedTech, setSelectedTech] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('beginner');
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch technologies and user's selected technologies
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = ((await response.json()) as any) as any;
        
        // Filter technologies with user selections
        const userTechs = data.technologies.filter((tech: any) => tech.proficiency_level);
        const allTechs = data.technologies;
        
        setTechnologies(allTechs);
        setUserTechnologies(userTechs);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router, session]);
  
  const handleAddTechnology = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!selectedTech) {
      setError('Please select a technology');
      return;
    }
    
    setIsAdding(true);
    
    try {
      const response = await fetch('/api/profile/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technology_id: selectedTech,
          proficiency_level: proficiencyLevel
        }),
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add technology');
      }
      
      // Refresh data
      const profileResponse = await fetch('/api/profile');
      const profileData = (await profileResponse.json()) as any;
      
      // Filter technologies with user selections
      const userTechs = profileData.technologies.filter((tech: any) => tech.proficiency_level);
      
      setUserTechnologies(userTechs);
      setSelectedTech('');
      setSuccessMessage('Technology added successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleRemoveTechnology = async (techId: string) => {
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`/api/profile/technologies?technology_id=${techId}`, {
        method: 'DELETE',
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove technology');
      }
      
      // Update local state
      setUserTechnologies(userTechnologies.filter(tech => tech.id !== parseInt(techId)));
      setSuccessMessage('Technology removed successfully');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading technologies...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Technologies</h1>
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
                      {session?.role === 'teacher' ? 'Technologies You Teach' : 'Technologies You Want to Learn'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {session?.role === 'teacher' 
                        ? 'Select the technologies you can teach to others.'
                        : 'Select the technologies you want to learn from others.'}
                    </p>
                  </div>
                  
                  {/* Current technologies */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700">Your Selected Technologies</h4>
                    {userTechnologies.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-500">
                        You haven't selected any technologies yet.
                      </p>
                    ) : (
                      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {userTechnologies.map((tech) => (
                          <li key={tech.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                            <div className="w-full flex items-center justify-between p-6 space-x-6">
                              <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-gray-900 text-sm font-medium truncate">{tech.name}</h3>
                                  <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                                    {tech.proficiency_level}
                                  </span>
                                </div>
                                <p className="mt-1 text-gray-500 text-sm truncate">{tech.description}</p>
                              </div>
                            </div>
                            <div>
                              <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="w-0 flex-1 flex">
                                  <button
                                    onClick={() => handleRemoveTechnology(tech.id)}
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
                  
                  {/* Add new technology */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Add a Technology</h4>
                    <form onSubmit={handleAddTechnology} className="space-y-4">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="technology" className="block text-sm font-medium text-gray-700">
                            Technology
                          </label>
                          <div className="mt-1">
                            <select
                              id="technology"
                              name="technology"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={selectedTech}
                              onChange={(e) => setSelectedTech(e.target.value)}
                              required
                            >
                              <option value="">Select a technology</option>
                              {technologies.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="sm:col-span-3">
                          <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700">
                            {session?.role === 'teacher' ? 'Teaching Proficiency' : 'Current Level'}
                          </label>
                          <div className="mt-1">
                            <select
                              id="proficiency"
                              name="proficiency"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={proficiencyLevel}
                              onChange={(e) => setProficiencyLevel(e.target.value)}
                              required
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isAdding || !selectedTech}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                          >
                            {isAdding ? 'Adding...' : 'Add Technology'}
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
