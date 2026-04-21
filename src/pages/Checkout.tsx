import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CreditCard, 
  Truck,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CONFIG from '@/lib/config';

import api from '@/lib/axios';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    province: 'Hồ Chí Minh',
    district: '',
    note: '',
    paymentMethod: 'COD' as 'COD' | 'Bank Transfer'
  });

  if (cart.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          province: formData.province,
          district: formData.district,
          note: formData.note
        },
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalAmount: getCartTotal(),
        paymentMethod: formData.paymentMethod
      };

      const { data } = await api.post('/orders', orderData);

      if (data) {
        setOrderNumber(data.orderNumber);
        setOrderSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error('Lỗi đặt hàng:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-40 pb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Đặt hàng thành công!</h2>
            <p className="text-zinc-500 mb-2 font-medium text-lg text-center">Cảm ơn bạn đã tin tưởng Nguyễn Bính Sports.</p>
            <p className="text-zinc-400 mb-8 font-bold uppercase tracking-widest text-xs">Mã đơn hàng: <span className="text-destructive">{orderNumber}</span></p>
            
            <div className="bg-zinc-50 p-8 rounded-3xl mb-10 text-left border border-zinc-100">
               <h4 className="font-black uppercase text-xs tracking-widest mb-4">Thông tin tiếp theo:</h4>
               <ul className="space-y-3 text-sm text-zinc-600 font-medium">
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    Nhân viên của chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 15-30 phút.
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    Đơn hàng sẽ được đóng gói và bàn giao cho đơn vị vận chuyển ngay trong ngày.
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    Bạn có thể kiểm tra email để xem lại chi tiết đơn hàng.
                  </li>
               </ul>
            </div>

            <Button asChild className="bg-zinc-950 hover:bg-destructive px-10 py-6 rounded-none font-black uppercase tracking-widest text-xs transition-all shadow-xl">
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans">
      <Navbar />
      
      <div className="bg-white border-b border-zinc-100 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <Link to="/cart" className="hover:text-destructive">Giỏ hàng</Link>
            <ChevronRight size={12} />
            <span className="text-destructive">Thanh toán</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: FORM THÔNG TIN */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                Thông tin <span className="text-destructive">giao hàng</span>
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Vui lòng điền chính xác thông tin để chúng tôi phục vụ bạn tốt nhất</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Họ và tên *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-destructive transition-colors" size={18} />
                  <Input 
                    required name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="Nguyễn Văn A" 
                    className="h-14 pl-12 rounded-2xl border-none shadow-sm focus-visible:ring-2 focus-visible:ring-destructive font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Số điện thoại *</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-destructive transition-colors" size={18} />
                  <Input 
                    required name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="090xxxxxxx" 
                    className="h-14 pl-12 rounded-2xl border-none shadow-sm focus-visible:ring-2 focus-visible:ring-destructive font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email (Nhận thông báo đơn hàng)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-destructive transition-colors" size={18} />
                <Input 
                  type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="example@gmail.com" 
                  className="h-14 pl-12 rounded-2xl border-none shadow-sm focus-visible:ring-2 focus-visible:ring-destructive font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tỉnh / Thành phố *</label>
                <select 
                  name="province" value={formData.province} onChange={handleInputChange}
                  className="w-full h-14 px-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-destructive font-bold text-sm outline-none appearance-none bg-white"
                >
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Khác">Tỉnh thành khác...</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Quận / Huyện *</label>
                <Input 
                  required name="district" value={formData.district} onChange={handleInputChange}
                  placeholder="Quận 1, Quận Bình Thạnh..." 
                  className="h-14 rounded-2xl border-none shadow-sm focus-visible:ring-2 focus-visible:ring-destructive font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Địa chỉ chi tiết *</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-6 text-zinc-300 group-focus-within:text-destructive transition-colors" size={18} />
                <textarea 
                  required name="address" value={formData.address} onChange={handleInputChange}
                  placeholder="Số nhà, tên đường..." 
                  className="w-full min-h-[100px] p-4 pl-12 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-destructive font-bold text-sm outline-none bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Ghi chú đơn hàng</label>
              <textarea 
                name="note" value={formData.note} onChange={handleInputChange}
                placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..." 
                className="w-full min-h-[100px] p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-destructive font-bold text-sm outline-none bg-white"
              />
            </div>

            <div className="pt-8 border-t border-zinc-200">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                <CreditCard className="text-destructive" /> Phương thức <span className="text-destructive">thanh toán</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-destructive bg-destructive/5' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}>
                  <input 
                    type="radio" name="paymentMethod" value="COD" 
                    checked={formData.paymentMethod === 'COD'} onChange={handleInputChange}
                    className="absolute opacity-0"
                  />
                  <Truck className={`mb-3 ${formData.paymentMethod === 'COD' ? 'text-destructive' : 'text-zinc-300'}`} size={24} />
                  <p className="font-black uppercase tracking-tight text-sm">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Kiểm tra hàng trước khi thanh toán</p>
                </label>
                <label className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Bank Transfer' ? 'border-destructive bg-destructive/5' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}>
                  <input 
                    type="radio" name="paymentMethod" value="Bank Transfer" 
                    checked={formData.paymentMethod === 'Bank Transfer'} onChange={handleInputChange}
                    className="absolute opacity-0"
                  />
                  <CreditCard className={`mb-3 ${formData.paymentMethod === 'Bank Transfer' ? 'text-destructive' : 'text-zinc-300'}`} size={24} />
                  <p className="font-black uppercase tracking-tight text-sm">Chuyển khoản ngân hàng</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Ưu tiên xử lý đơn hàng nhanh nhất</p>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-8">
              <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white p-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8 border-b border-zinc-50 pb-6">
                  Tóm tắt <span className="text-destructive">đơn hàng</span>
                </h3>
                
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-6 mb-8">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black uppercase tracking-tighter text-xs line-clamp-1">{item.name}</h4>
                        {item.variantLabel && (
                          <p className="text-[9px] font-black text-destructive uppercase tracking-widest">{item.variantLabel}</p>
                        )}
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SL: {item.quantity} x {item.price.toLocaleString()}₫</p>
                      </div>
                      <div className="font-black text-sm text-zinc-900 tracking-tighter">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-50 mb-10">
                  <div className="flex justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Tổng tiền hàng:</span>
                    <span className="text-zinc-900">{getCartTotal().toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-500 font-black">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="font-black uppercase tracking-tighter text-sm italic">Tổng cộng:</span>
                    <span className="text-3xl font-black text-destructive tracking-tighter leading-none">
                      {getCartTotal().toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" disabled={loading}
                  className="w-full h-16 bg-destructive hover:bg-zinc-900 transition-all duration-500 rounded-none font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-destructive/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Xác nhận đặt hàng</>
                  )}
                </Button>

                <p className="text-[9px] text-center text-zinc-400 font-bold uppercase mt-6 tracking-widest">
                  Bằng cách nhấn nút đặt hàng, bạn đồng ý với các <br/>
                  <Link to="/" className="text-destructive underline">điều khoản mua hàng</Link> của chúng tôi
                </p>
              </Card>

              <Link to="/cart" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-destructive transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </form>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Checkout;
