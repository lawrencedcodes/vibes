"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function ProfilePage() {
  const router = useRouter();
  const session = getSession();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    photo_url: ''
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = ((await response.json()) as any) as any;
        
        setFormData({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          photo_url: data.user.photo_url || ''
        });
        
        if (data.user.photo_url) {
          setPhotoPreview(data.user.photo_url);
        }
        
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router, session]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    
    // In a real application, you would upload to a storage service
    // For this demo, we'll simulate by returning a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, this would be the URL returned from your storage service
        resolve(reader.result as string);
      };
      reader.readAsDataURL(photoFile);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSaving(true);
    
    try {
      // Upload photo if changed
      let photoUrl = formData.photo_url;
      if (photoFile) {
        photoUrl = await uploadPhoto() || '';
      }
      
      // Update profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          photo_url: photoUrl
        }),
      });
      
      const data = ((await response.json()) as any) as any;
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      setSuccessMessage('Profile updated successfully');
      
      // Update form data with response
      setFormData(prev => ({
        ...prev,
        photo_url: data.user.photo_url || ''
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Profile</h1>
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
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and profile photo.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            autoComplete="given-name"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.first_name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            autoComplete="family-name"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.last_name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            disabled
                            className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.email}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Email address cannot be changed.
                        </p>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                          Profile photo
                        </label>
                        <div className="mt-2 flex items-center">
                          {photoPreview ? (
                            <div className="relative h-40 w-40 overflow-hidden rounded-full">
                              <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-40 w-40 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-4xl">
                                {formData.first_name && formData.last_name
                                  ? `${formData.first_name[0]}${formData.last_name[0]}`
                                  : 'User'}
                              </span>
                            </div>
                          )}
                          <div className="ml-5">
                            <div className="rounded-md border border-gray-300 px-3 py-2">
                              <label
                                htmlFor="photo-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Change photo</span>
                                <input
                                  id="photo-upload"
                                  name="photo-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handlePhotoChange}
                                />
                              </label>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
