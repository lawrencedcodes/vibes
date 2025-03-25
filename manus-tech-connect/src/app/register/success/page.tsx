"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function PostRegistrationRedirect() {
  const router = useRouter();
  const session = getSession();
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Redirect to onboarding after successful registration
    router.push('/onboarding');
  }, [router, session]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}
