"use client";

import { getSession } from '@/lib/auth/auth-utils';
import Link from 'next/link';

export default function DashboardPage() {
  const session = getSession();
  
  if (!session) {
    return null; // This should be handled by middleware, but just in case
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {session.firstName} {session.lastName}
            </span>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-4 min-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Your Profile</h3>
                    <div className="mt-5">
                      <div className="flex flex-col space-y-3">
                        <p className="text-sm text-gray-500">
                          Complete your profile to get started with Tech Connect.
                        </p>
                        <Link
                          href="/profile"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
                        >
                          Update Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {session.role === 'teacher' ? (
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Teaching</h3>
                      <div className="mt-5">
                        <div className="flex flex-col space-y-3">
                          <p className="text-sm text-gray-500">
                            Set up your teaching preferences and availability.
                          </p>
                          <Link
                            href="/teaching-setup"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
                          >
                            Set Up Teaching
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Learning</h3>
                      <div className="mt-5">
                        <div className="flex flex-col space-y-3">
                          <p className="text-sm text-gray-500">
                            Find teachers for the technologies you want to learn.
                          </p>
                          <Link
                            href="/find-teachers"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
                          >
                            Find Teachers
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Your Connections</h3>
                    <div className="mt-5">
                      <div className="flex flex-col space-y-3">
                        <p className="text-sm text-gray-500">
                          View and manage your connections with other users.
                        </p>
                        <Link
                          href="/connections"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
                        >
                          View Connections
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Availability</h3>
                    <div className="mt-5">
                      <div className="flex flex-col space-y-3">
                        <p className="text-sm text-gray-500">
                          Set your availability for teaching or learning sessions.
                        </p>
                        <Link
                          href="/availability"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
                        >
                          Set Availability
                        </Link>
                      </div>
                    </div>
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
