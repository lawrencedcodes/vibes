"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';
import Link from 'next/link';

export default function FindTeachersPage() {
  const router = useRouter();
  const session = getSession();
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.role === 'teacher') {
      // Teachers shouldn't access this page
      router.push('/dashboard');
      return;
    }
    
    // Fetch teachers and technologies
    const fetchData = async () => {
      try {
        // Fetch technologies
        const techResponse = await fetch('/api/profile');
        
        if (!techResponse.ok) {
          throw new Error('Failed to fetch technologies');
        }
        
        const techData = (await techResponse.json()) as any;
        setTechnologies(techData.technologies || []);
        
        // Fetch teachers
        const teacherResponse = await fetch('/api/teachers');
        
        if (!teacherResponse.ok) {
          throw new Error('Failed to fetch teachers');
        }
        
        const teacherData = (await teacherResponse.json()) as any;
        setTeachers(teacherData.teachers || []);
        setFilteredTeachers(teacherData.teachers || []);
        
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router, session]);
  
  const handleTechChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const techId = e.target.value;
    setSelectedTech(techId);
    
    if (!techId) {
      // If no technology selected, show all teachers
      setFilteredTeachers(teachers);
      return;
    }
    
    // Filter teachers by selected technology
    const filtered = teachers.filter(teacher => 
      teacher.technologies.some((tech: any) => tech.id.toString() === techId)
    );
    
    setFilteredTeachers(filtered);
  };
  
  const handleConnect = async (teacherId: number) => {
    if (!selectedTech) {
      setError('Please select a technology first');
      return;
    }
    
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          technology_id: selectedTech
        }),
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
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
          <p className="text-lg text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find Teachers</h1>
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
            
            <div className="bg-white shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Filter Teachers by Technology
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Select a technology to find teachers who can help you learn it.</p>
                </div>
                <div className="mt-5">
                  <select
                    id="technology"
                    name="technology"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={selectedTech}
                    onChange={handleTechChange}
                  >
                    <option value="">All Technologies</option>
                    {technologies.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {filteredTeachers.length === 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    No Teachers Found
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                    <p>There are no teachers available for the selected technology.</p>
                    <p className="mt-2">Please check back later or select a different technology.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {teacher.photo_url ? (
                            <img
                              className="h-12 w-12 rounded-full"
                              src={teacher.photo_url}
                              alt={`${teacher.first_name} ${teacher.last_name}`}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-lg">
                                {teacher.first_name[0]}{teacher.last_name[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Teacher
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Technologies
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {teacher.technologies.map((tech: any) => (
                          <li key={tech.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">{tech.name}</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {tech.proficiency_level}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Availability
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {teacher.availability.map((avail: any) => (
                          <li key={avail.day_of_week} className="text-sm text-gray-900">
                            {dayNames[avail.day_of_week]}: {avail.start_time} - {avail.end_time}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="px-4 py-4 sm:px-6">
                      <button
                        onClick={() => handleConnect(teacher.id)}
                        disabled={!selectedTech}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
