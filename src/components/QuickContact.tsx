import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Facebook } from 'lucide-react';
import api from '@/lib/axios';

interface IContact {
  phone: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
  };
}

const QuickContact: React.FC = () => {
  const [contact, setContact] = useState<IContact | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await api.get('/contact');
        setContact(data);
      } catch (error) {
        console.error('Lỗi lấy thông tin liên hệ nhanh:', error);
      }
    };
    fetchContact();
  }, []);

  if (!contact) return null;

  const phoneNoSpace = contact.phone.replace(/\s/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end animate-in slide-in-from-bottom-10 duration-1000">
      
      {/* MESSENGER BUBBLE */}
      {contact.socialLinks.facebook && (
        <a 
          href={contact.socialLinks.facebook}
          target="_blank" 
          rel="noreferrer"
          aria-label="Liên hệ qua Messenger"
          className="group relative flex items-center gap-3"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl border border-zinc-100 whitespace-nowrap">
            Chat Messenger
          </span>
          <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-110 hover:rotate-12 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" alt="Messenger" className="w-7 h-7 brightness-0 invert" />
          </div>
        </a>
      )}

      {/* ZALO BUBBLE */}
      <a 
        href={`https://zalo.me/${phoneNoSpace}`}
        target="_blank" 
        rel="noreferrer"
        aria-label="Liên hệ qua Zalo"
        className="group relative flex items-center gap-3"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl border border-zinc-100 whitespace-nowrap">
          Chat Zalo
        </span>
        <div className="w-14 h-14 bg-[#008fe5] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,143,229,0.4)] hover:scale-110 hover:-rotate-12 transition-all duration-300">
           <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-7 h-7 brightness-0 invert" />
        </div>
      </a>

      {/* HOTLINE BUBBLE */}
      <a 
        href={`tel:${phoneNoSpace}`}
        aria-label="Gọi hotline"
        className="group relative flex items-center gap-3"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-zinc-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl border border-zinc-100 whitespace-nowrap">
          Hotline: {contact.phone}
        </span>
        <div className="relative w-14 h-14 bg-destructive text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:scale-110 transition-all duration-300 overflow-hidden">
           {/* Hiệu ứng sóng lan tỏa cho hotline */}
           <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
           <Phone size={24} fill="currentColor" className="relative z-10" />
        </div>
      </a>

    </div>
  );
};

export default QuickContact;
