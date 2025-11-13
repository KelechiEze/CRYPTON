import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const CustomerCareButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    if (window.Tawk_API) {
      if (!isChatOpen) {
        window.Tawk_API.maximize();
      } else {
        window.Tawk_API.minimize();
      }
      setIsChatOpen(!isChatOpen);
    }
  };

  const openChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
      setIsChatOpen(true);
    }
  };

  const closeChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.minimize();
      setIsChatOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Customer Care"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Status Indicator */}
      <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className={`w-2 h-2 rounded-full ${isChatOpen ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {isChatOpen ? 'Chat Open' : 'Chat Available'}
        </span>
      </div>
    </>
  );
};

export default CustomerCareButton;