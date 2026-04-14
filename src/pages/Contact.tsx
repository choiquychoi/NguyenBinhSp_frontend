import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CONFIG from '@/lib/config';

interface IContact {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    tiktok?: string;
    instagram?: string;
  };
  seoTitle: string;
  seoDescription: string;
}

const Contact: React.FC = () => {
  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`${CONFIG.API_URL}/contact`);
        const data = await response.json();
        setContact(data);
        if (data) {
          document.title = data.seoTitle || 'Liên hệ | Nguyễn Bính Sports';
        }
      } catch (error) {
        console.error('Lỗi tải thông tin liên hệ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-red-600 animate-pulse uppercase tracking-[0.3em]">Kết nối shop...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic">
            Get In <span className="text-red-600 underline decoration-8 underline-offset-8">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-bold text-xl uppercase tracking-widest opacity-80">
            Nguyễn Bính Sports • {contact?.companyName}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-32">
        {/* BIG CONTACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Hotline */}
          <a href={`tel:${contact?.phone}`} className="group bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-red-100">
            <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
              <Phone size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Đường dây nóng</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter italic">{contact?.phone}</p>
          </a>

          {/* Social / Zalo */}
          <div className="group bg-gray-950 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center text-white transition-all hover:-translate-y-2">
            <div className="p-6 bg-white/10 text-red-600 rounded-[2rem] mb-6">
              <MessageCircle size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Mạng xã hội</h3>
            <div className="flex space-x-4">
              {contact?.socialLinks.facebook && (
                <a href={contact.socialLinks.facebook} target="_blank" className="p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all">
                  <Facebook size={20} />
                </a>
              )}
              {contact?.socialLinks.zalo && (
                <a href={`https://zalo.me/${contact.socialLinks.zalo}`} target="_blank" className="px-6 py-4 bg-white/5 rounded-2xl hover:bg-green-600 transition-all font-black text-xs uppercase tracking-tighter">
                  Zalo
                </a>
              )}
              {contact?.socialLinks.tiktok && (
                <a href={contact.socialLinks.tiktok} target="_blank" className="p-4 bg-white/5 rounded-2xl hover:bg-gray-800 transition-all">
                  <span className="font-black text-xs">TT</span>
                </a>
              )}
            </div>
          </div>

          {/* Email */}
          <a href={`mailto:${contact?.email}`} className="group bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-blue-100">
            <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Mail size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Email hỗ trợ</h3>
            <p className="text-lg font-black text-gray-900 tracking-tight lowercase">{contact?.email}</p>
          </a>
        </div>

        {/* FULL WIDTH INFO & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Address Card */}
          <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50 flex flex-col justify-center">
            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-gray-50 text-gray-900 rounded-2xl"><MapPin size={24} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Địa chỉ cửa hàng</h4>
                  <p className="text-xl font-bold text-gray-900 leading-tight">{contact?.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-gray-50 text-gray-900 rounded-2xl"><Clock size={24} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lịch làm việc</h4>
                  <p className="text-xl font-bold text-gray-900 leading-tight">08:00 AM - 21:00 PM<br/>Tất cả các ngày trong tuần</p>
                </div>
              </div>
              <button className="flex items-center space-x-3 text-red-600 font-black uppercase text-xs tracking-widest hover:translate-x-2 transition-transform">
                <span>Chỉ đường trên Google Maps</span>
                <Navigation size={16} />
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3 h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white">
            {contact?.mapUrl ? (
              <iframe 
                src={contact.mapUrl} 
                className="w-full h-full border-none grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
                loading="lazy" 
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center font-black text-gray-200 uppercase tracking-[0.5em]">Map Loading...</div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
