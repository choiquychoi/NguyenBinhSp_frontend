import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight,
  Phone,
  Hash,
  ArrowRight,
  Loader2,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from '@/lib/axios';

interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
  };
  items: any[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipping' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const statusSteps = [
  { status: 'Pending', label: 'Chờ xác nhận', icon: Clock, desc: 'Đơn hàng của bạn đang được hệ thống tiếp nhận.' },
  { status: 'Confirmed', label: 'Đã xác nhận', icon: CheckCircle2, desc: 'Nhân viên đã xác nhận và đang chuẩn bị hàng.' },
  { status: 'Shipping', label: 'Đang giao hàng', icon: Truck, desc: 'Đơn hàng đang trên đường đến với bạn.' },
  { status: 'Delivered', label: 'Hoàn thành', icon: ShoppingBag, desc: 'Đơn hàng đã được giao thành công.' },
];

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !phone) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Gọi API tra cứu công khai
      const { data } = await api.get(`/orders/track/${orderNumber.trim()}?phone=${phone.trim()}`);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    return statusSteps.findIndex(s => s.status === status);
  };

  const currentIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans text-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-destructive/20 via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic mb-6">
              Tra cứu <span className="text-destructive">đơn hàng</span>
            </h1>
            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em]">Theo dõi hành trình đơn hàng của bạn mọi lúc, mọi nơi</p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 -mt-10 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Form Tra Cứu */}
          <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white mb-12">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                    <Hash size={14} className="text-destructive" /> Mã đơn hàng *
                  </label>
                  <Input 
                    placeholder="VD: ORD171265xxxx" 
                    className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 font-black uppercase text-sm focus-visible:ring-destructive"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-4 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 flex items-center gap-2">
                    <Phone size={14} className="text-destructive" /> Số điện thoại *
                  </label>
                  <Input 
                    placeholder="Nhập số điện thoại đặt hàng" 
                    className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold text-sm focus-visible:ring-destructive"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-zinc-950 hover:bg-destructive rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all group"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Tìm đơn hàng <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></>}
                  </Button>
                </div>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 border border-red-100"
                  >
                    <XCircle size={18} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Kết Quả Tra Cứu */}
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Status Timeline */}
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-zinc-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Trạng thái <span className="text-destructive">đơn hàng</span></h2>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Mã số: {order.orderNumber}</p>
                    </div>
                    {order.status === 'Cancelled' ? (
                        <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black uppercase text-xs border border-red-100 flex items-center gap-2">
                            <XCircle size={18} /> Đã hủy đơn hàng
                        </div>
                    ) : (
                        <div className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl font-black uppercase text-xs border border-green-100 flex items-center gap-2">
                            <CheckCircle2 size={18} /> Đang cập nhật...
                        </div>
                    )}
                  </div>

                  {order.status !== 'Cancelled' && (
                    <div className="relative">
                      {/* Line nối */}
                      <div className="absolute left-8 md:left-0 md:top-8 md:w-full h-full md:h-1 bg-zinc-100 z-0">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                            className="h-full bg-destructive transition-all duration-1000"
                         />
                      </div>

                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
                        {statusSteps.map((step, idx) => {
                          const isCompleted = idx <= currentIndex;
                          const isActive = idx === currentIndex;
                          const Icon = step.icon;

                          return (
                            <div key={idx} className="flex md:flex-col items-center md:text-center gap-6 md:gap-6">
                              <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl
                                ${isCompleted ? 'bg-destructive text-white shadow-destructive/20' : 'bg-white text-zinc-300 border border-zinc-100'}
                                ${isActive ? 'scale-125 ring-8 ring-destructive/10' : ''}
                              `}>
                                <Icon size={24} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-zinc-950' : 'text-zinc-300'}`}>
                                  {step.label}
                                </h4>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase leading-relaxed hidden md:block">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Thông Tin Chi Tiết */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                      <MapPin size={20} className="text-destructive" /> Thông tin <span className="text-destructive">nhận hàng</span>
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Người nhận</p>
                        <p className="font-black uppercase text-sm">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                        <p className="font-bold text-sm">{order.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
                        <p className="font-bold text-sm text-zinc-600 leading-relaxed">
                          {order.customer.address}, {order.customer.district}, {order.customer.province}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                      <ShoppingBag size={20} className="text-destructive" /> Chi tiết <span className="text-destructive">sản phẩm</span>
                    </h3>
                    <div className="space-y-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img src={item.image} className="w-14 h-14 rounded-xl object-cover border border-zinc-50" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.name}</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SL: {item.quantity} x {item.price.toLocaleString()}₫</p>
                          </div>
                          <p className="font-black text-sm">{(item.price * item.quantity).toLocaleString()}₫</p>
                        </div>
                      ))}
                      <div className="pt-6 border-t border-zinc-50 flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tổng thanh toán</span>
                        <span className="text-2xl font-black text-destructive tracking-tighter">{order.totalAmount.toLocaleString()}₫</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!order && !loading && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                <Search size={32} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Nhập thông tin để bắt đầu tra cứu</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
