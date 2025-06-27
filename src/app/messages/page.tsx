'use client';

import { FaPaperPlane, FaUser, FaCheck } from 'react-icons/fa'

// Mock data for conversations
const conversations = [
  {
    id: 1,
    user: 'John Smith',
    lastMessage: 'When can I schedule a viewing?',
    time: '10:30 AM',
    unread: true,
    verified: true,
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    lastMessage: 'Thank you for your interest!',
    time: 'Yesterday',
    unread: false,
    verified: true,
  },
]

// Mock data for messages
const messages = [
  {
    id: 1,
    sender: 'John Smith',
    content: 'Hi, I\'m interested in your property.',
    time: '10:15 AM',
    isOwn: false,
  },
  {
    id: 2,
    sender: 'You',
    content: 'Hello! Thanks for your interest. What would you like to know?',
    time: '10:20 AM',
    isOwn: true,
  },
  {
    id: 3,
    sender: 'John Smith',
    content: 'When can I schedule a viewing?',
    time: '10:30 AM',
    isOwn: false,
  },
]

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{conversation.user}</h3>
                      {conversation.verified && (
                        <span className="badge badge-verified">Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{conversation.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{conversation.time}</p>
                    {conversation.unread && (
                      <span className="inline-block w-2 h-2 bg-primary-600 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-4 border-b">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">John Smith</h3>
                  <span className="badge badge-verified">Verified</span>
                </div>
                <p className="text-sm text-gray-600">Modern Downtown Apartment</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isOwn ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      message.isOwn
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.isOwn ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {message.time}
                      {message.isOwn && (
                        <FaCheck className="inline-block ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="input flex-1"
                />
                <button className="btn-primary">
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 