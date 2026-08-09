import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded buttons */}
      {isOpen && (
        <div className="flex flex-col gap-3 items-end animate-fade-in">
          {/* Call button */}
          <a
            href="tel:+919999999999"
            className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 group"
          >
            <span className="text-sm font-medium">Call now</span>
            <div className="bg-blue-400 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
              <Phone size={18} className="text-white" />
            </div>
          </a>

          {/* WhatsApp button */}
          <a
            href="https://wa.me/7800017055"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 group"
          >
            <span className="text-sm font-medium">Connect On</span>
            <div className="bg-green-500 p-2 rounded-full group-hover:bg-green-600 transition-colors">
              <FaWhatsapp size={18} className="text-white" />
            </div>
          </a>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-red-500' : 'bg-[#FF6B6B]'
        }`}
      >
        {isOpen ? (
          <X size={28} className="text-white" />
        ) : (
          <div className="relative">
            <MessageCircle size={28} className="text-white" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-0.5">
              <div className="w-4 h-0.5 bg-white rounded-full"></div>
              <div className="w-4 h-0.5 bg-white rounded-full"></div>
              <div className="w-4 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
