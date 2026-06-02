import React from 'react';

export const WhatsAppButton: React.FC = () => {
  // WhatsApp business number for Exotic Interior (format: +countrycode phonenumber)
  const phoneNumber = '+918919445788';
  const message = 'Hello! I\'m interested in your interior design services. Can you tell me more about your offerings?';
  
  // Create WhatsApp link
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Main Button */}
      <div className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer">
        {/* WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.561.949-2.605 2.576-2.605 4.307 0 1.718.997 3.308 2.686 4.297l-.375 1.385 1.558-.505c.897.537 1.9.812 2.996.812 5.45 0 9.885-4.467 9.885-9.965 0-2.66-1.026-5.16-2.876-7.045-1.852-1.986-4.318-3.08-6.88-3.084m5.64 17.810h.006c1.852 0 3.635-.481 5.215-1.377l.604.196 1.097-.356-.704 2.585a9.954 9.954 0 01-1.565 1.29c-1.746 1.245-3.957 1.958-6.364 1.962h-.006c-5.609 0-10.235-4.51-10.235-10.088 0-2.113.653-4.164 1.846-5.897L2.821 2.347l2.684.873A10.066 10.066 0 0110.07 2c5.647 0 10.24 4.51 10.24 10.087" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-charcoal text-cream px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
        Chat with us
        <div className="absolute bottom-0 right-6 transform translate-y-full">
          <div className="border-8 border-transparent border-t-charcoal"></div>
        </div>
      </div>
    </a>
  );
};
