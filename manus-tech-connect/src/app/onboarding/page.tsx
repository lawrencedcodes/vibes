"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Fetch user data to check registration status
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          // If not authenticated, redirect to login
          router.push('/login');
          return;
        }
        
        const data = ((await response.json()) as any) as any;
        setUserData(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/login');
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };
  
  const getStepUrl = () => {
    switch (step) {
      case 1:
        return '/profile';
      case 2:
        return '/technologies';
      case 3:
        return '/availability';
      default:
        return '/dashboard';
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Tech Connect!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's set up your profile as a {userData.role === 'teacher' ? 'Teacher' : 'Learner'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {step === 1 && 'Step 1: Complete Your Profile'}
                  {step === 2 && 'Step 2: Select Your Technologies'}
                  {step === 3 && 'Step 3: Set Your Availability'}
                  {step === 4 && 'All Set!'}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Step {step} of 4
                </span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {step === 1 && 'Add your personal information and profile photo.'}
                  {step === 2 && `Select the technologies you ${userData.role === 'teacher' ? 'can teach' : 'want to learn'}.`}
                  {step === 3 && 'Set your weekly availability for sessions.'}
                  {step === 4 && 'Your profile is now complete! You can start using Tech Connect.'}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">Progress</span>
              </div>
            </div>
            
            <div>
              <div className="overflow-hidden bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {step < 4 ? (
              <div>
                <Link
                  href={getStepUrl()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {step === 1 && 'Complete Profile'}
                  {step === 2 && 'Select Technologies'}
                  {step === 3 && 'Set Availability'}
                </Link>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Skip for now
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
