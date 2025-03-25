"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth/auth-utils';

export default function MessagesPage({
  params
}: {
  params: { connectionId: string }
}) {
  const router = useRouter();
  const session = getSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [connection, setConnection] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  
  const connectionId = params.connectionId;
  
  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (!connectionId) {
      router.push('/connections');
      return;
    }
    
    // Fetch messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${connectionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/connections');
            return;
          }
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data.messages || []);
        setOtherUser(data.otherUser);
        setConnection(data.connection);
        setIsLoading(false);
        
        // Scroll to bottom
        scrollToBottom();
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [router, session, connectionId]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }
    
    setIsSending(true);
    setError('');
    
    try {
      const response = await fetch(`/api/messages/${connectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Add new message to the list
      const sentMessage = {
        ...data.message,
        first_name: session?.firstName,
        last_name: session?.lastName,
        photo_url: null // We don't have this in the session
      };
      
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/connections')}
                className="mr-4 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              {otherUser && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {otherUser.photo_url ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={otherUser.photo_url}
                        alt={`${otherUser.first_name} ${otherUser.last_name}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {otherUser.first_name[0]}{otherUser.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h1 className="text-xl font-bold text-gray-900">
                      {otherUser.first_name} {otherUser.last_name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {session?.role === 'teacher' ? 'Learner' : 'Teacher'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
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
          
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isCurrentUser = message.sender_id === session?.userId;
                  const showDate = index === 0 || 
                    formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <div className="bg-gray-200 rounded-full px-4 py-1 text-xs text-gray-600">
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-xs md:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="flex-shrink-0">
                            {!isCurrentUser && (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                {message.photo_url ? (
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={message.photo_url}
                                    alt={`${message.first_name} ${message.last_name}`}
                                  />
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    {message.first_name[0]}{message.last_name[0]}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <div className={`rounded-lg px-4 py-2 ${
                              isCurrentUser 
                                ? 'bg-indigo-600 text-white mr-2' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p>{message.content}</p>
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${
                              isCurrentUser ? 'text-right mr-2' : 'text-left'
                            }`}>
                              {formatTime(message.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
