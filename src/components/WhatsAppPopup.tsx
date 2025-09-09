import React from 'react';
import { X, MessageCircle } from 'lucide-react';

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  contactName: string;
  studentName: string;
}

const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  contactName,
  studentName
}) => {
  if (!isOpen) return null;

  const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  
  const defaultMessage = `Merhaba ${contactName}, ${studentName} hakkında bilgi almak istiyorum.`;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const fullUrl = `${whatsappUrl}?text=${encodedMessage}`;
    window.open(fullUrl, '_blank');
    onClose();
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">İletişim Seçenekleri</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">İletişim:</p>
            <p className="font-medium text-gray-900">{contactName}</p>
            <p className="text-sm text-gray-500">{studentName} - Veli</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Telefon:</p>
            <p className="font-mono text-lg text-gray-900">{phoneNumber}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp'ta Aç</span>
            </button>
            
            <button
              onClick={handleCopyNumber}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>Telefon Numarasını Kopyala</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup; 