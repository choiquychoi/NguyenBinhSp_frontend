import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import CONFIG from '@/lib/config';
import logo from '@/assets/logo.jpg';

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
}

import api from '@/lib/axios';

const Footer = () => {
  const [contact, setContact] = useState<IContact | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await api.get('/contact');
        setContact(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin Footer:', error);
      }
    };
    fetchContact();
  }, []);

  return (
    <footer className="bg-zinc-950 text-white pt-0">
      {/* Newsletter Section */}
      <div className="bg-zinc-900/50 border-y border-zinc-800 py-16">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
              Đăng ký nhận <span className="text-destructive">tin mới nhất</span>
            </h3>
            <p className="text-zinc-400 font-medium max-w-md">
              Nhận thông tin về sản phẩm mới, sự kiện và khuyến mãi hấp dẫn từ {contact?.companyName || 'Nguyễn Bính Sports'}.
            </p>
          </div>
          <div className="flex w-full max-w-md group">
            <Input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className="h-14 rounded-r-none border-zinc-700 bg-zinc-800/50 focus:ring-destructive focus:border-destructive text-white placeholder:text-zinc-500"
            />
            <Button className="h-14 px-8 rounded-l-none bg-destructive hover:bg-destructive/90 font-black uppercase tracking-widest transition-all">
              <Send className="h-5 w-5 mr-2" />
              Đăng ký
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-destructive shadow-xl">
                <img 
                  src={logo} 
                  alt={`Logo ${contact?.companyName || 'Nguyễn Bính Sports'}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tighter text-destructive">
                  {contact?.companyName ? contact.companyName.split(' ')[0] : 'Nguyễn'}
                  {contact?.companyName && contact.companyName.split(' ').length > 1 ? contact.companyName.split(' ')[1] : 'Bính'}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-green-500">
                  {contact?.companyName && contact.companyName.split(' ').length > 2 ? contact.companyName.split(' ').slice(2).join(' ') : 'Sports'}
                </span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
              Hệ thống phân phối dụng cụ thể thao chuyên nghiệp hàng đầu. Chuyên cung cấp Vợt Cầu Lông, Pickleball, Giày và Phụ kiện chính hãng.
            </p>
            <div className="flex gap-4">
              {contact?.socialLinks.facebook && (
                <a 
                  href={contact.socialLinks.facebook} 
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:bg-destructive hover:border-destructive transition-all duration-300 group"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                </a>
              )}
              {contact?.socialLinks.instagram && (
                <a 
                  href={contact.socialLinks.instagram} 
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:bg-destructive hover:border-destructive transition-all duration-300 group"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                </a>
              )}
              {contact?.socialLinks.zalo && (
                <a 
                  href={`https://zalo.me/${contact.socialLinks.zalo}`} 
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:bg-destructive hover:border-destructive transition-all duration-300 group"
                  title="Zalo"
                >
                  <MessageCircle className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                </a>
              )}
              {contact?.socialLinks.tiktok && (
                <a 
                  href={contact.socialLinks.tiktok} 
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:bg-destructive hover:border-destructive transition-all duration-300 group"
                  title="TikTok"
                >
                  <span className="text-[10px] font-black text-zinc-400 group-hover:text-white">TT</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-white">Sản phẩm</h3>
            <ul className="space-y-4">
              {[
                { name: "Cầu lông", path: "/category/Cầu lông" },
                { name: "Pickleball", path: "/category/Pickleball" },
                { name: "Tennis", path: "/category/Tennis" },
                { name: "Dây Đan Vợt", path: "/category/Dây Đan Vợt" },
                { name: "Giày Thể Thao", path: "/category/Giày Thể Thao" },
                { name: "Phụ Kiện", path: "/category/Phụ Kiện" },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-destructive transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-white">Về chúng tôi</h3>
            <ul className="space-y-4">
              {[
                { name: "Giới thiệu", path: "/" },
                { name: "Tin tức & Sự kiện", path: "/news" },
                { name: "Liên hệ", path: "/contact" }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-destructive transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-white">Hỗ trợ</h3>
            <ul className="space-y-4">
              {["Bảo hành", "Đổi trả", "Vận chuyển", "FAQ", "Bảo mật"].map(link => (
                <li key={link}>
                  <Link to="/contact" className="text-zinc-400 hover:text-destructive transition-colors text-sm font-medium">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-white">Liên hệ</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="h-5 w-5 text-destructive shrink-0" />
                <span className="text-zinc-400 text-sm font-medium">{contact?.address || 'Số 123, Đường ABC, TP. Hồ Chí Minh'}</span>
              </li>
              <li className="flex gap-4">
                <Phone className="h-5 w-5 text-destructive shrink-0" />
                <a href={`tel:${contact?.phone}`} className="text-zinc-400 text-sm font-medium hover:text-destructive transition-colors">{contact?.phone || '0901234567'}</a>
              </li>
              <li className="flex gap-4">
                <Mail className="h-5 w-5 text-destructive shrink-0" />
                <a href={`mailto:${contact?.email}`} className="text-zinc-400 text-sm font-medium hover:text-destructive transition-colors">{contact?.email || 'contact@nguyenbinhsports.com'}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-zinc-900 py-8 bg-zinc-950">
        <div className="container mx-auto px-4 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-zinc-500 text-xs font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} {contact?.companyName || 'Nguyễn Bính Sports'}. All Rights Reserved.
          </p>
          <div className="flex gap-3">
            {["VISA", "MASTERCARD", "MOMO", "VNPAY"].map(tag => (
              <Badge key={tag} variant="secondary" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

