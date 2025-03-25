"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const session = getSession();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user's notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        setNotifications(data.notifications || []);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [router, session]);
  
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_id: notificationId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, is_read: 1 } : notification
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13V19M18 16H13M6 16H8M6 12H15M6 8H8" />
              </svg>
            </div>
          </div>
        );
      case 'connection_accepted':
        return (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        );
      case 'connection_rejected':
        return (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        );
      case 'message_received':
        return (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        );
    }
  };
  
  const getNotificationAction = (notification: any) => {
    if (notification.type === 'connection_request' && session?.role === 'teacher') {
      return (
        <Link
          href="/connections"
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Request
        </Link>
      );
    }
    
    if (notification.type === 'connection_accepted') {
      return (
        <Link
          href={`/messages/${notification.connection_id}`}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Message
        </Link>
      );
    }
    
    if (notification.type === 'message_received') {
      return (
        <Link
          href={`/messages/${notification.connection_id}`}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reply
        </Link>
      );
    }
    
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
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
            
            {notifications.length === 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    No Notifications
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                    <p>You don't have any notifications yet.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`p-4 ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="flex items-start space-x-4">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.content}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Mark as read
                            </button>
                          )}
                          {getNotificationAction(notification)}
                        </div>
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
