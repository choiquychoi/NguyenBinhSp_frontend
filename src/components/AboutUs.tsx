import React from 'react';
import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Star, ArrowUpRight } from "lucide-react";
import storeImg from '@/assets/store.jpg';

const AboutUs: React.FC = () => {
  const imageUrl = storeImg;


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <Badge className="mb-4 px-4 py-1 text-xs font-black uppercase tracking-widest bg-destructive text-white border-none rounded-full">
            Câu chuyện thương hiệu
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Nguyễn Bính <span className="text-destructive">Sports</span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-4 md:gap-6"
        >
          {/* Tile 1: Main Brand Image (Large) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 lg:col-span-4 lg:row-span-2 relative rounded-[2rem] overflow-hidden group shadow-xl"
          >
            <img 
              src={imageUrl} 
              alt="Store Front" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-3xl font-black text-white uppercase mb-2">Không gian chuyên nghiệp</h3>
              <p className="text-white/80 text-sm font-medium max-w-md">
                Nơi hội tụ những dòng vợt đỉnh cao và dịch vụ đan vợt chuẩn thi đấu quốc tế.
              </p>
            </div>
          </motion.div>

          {/* Tile 2: Mission/Slogan (Accent Color) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 bg-destructive p-8 rounded-[2rem] flex flex-col justify-between text-white shadow-lg shadow-destructive/20 group"
          >
            <div className="flex justify-between items-start">
              <Star className="h-8 w-8 fill-white" />
              <ArrowUpRight className="h-6 w-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <div>
              <p className="text-2xl font-black uppercase leading-tight mb-4">
                Đam mê dẫn lối <br /> thành công
              </p>
              <p className="text-white/80 text-xs font-bold tracking-widest uppercase">Tận tâm phục vụ từ 2016</p>
            </div>
          </motion.div>

          {/* Tile 3: Experience Stat (Square) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-5xl font-black text-destructive mb-2">10+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Năm kinh nghiệm</span>
          </motion.div>

          {/* Tile 4: Customer Stat (Square) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <Users className="h-8 w-8 text-destructive mb-4" />
            <span className="text-2xl font-black">+5000</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Khách hàng</span>
          </motion.div>

          {/* Tile 5: Authentic Commitment (Wide) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 bg-zinc-900 text-white p-8 rounded-[2rem] flex items-center gap-6 shadow-xl"
          >
            <div className="bg-white/10 p-4 rounded-2xl">
              <ShieldCheck className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase">Chính hãng 100%</h4>
              <p className="text-white/50 text-xs">Phân phối trực tiếp từ Yonex, Victor, Lining.</p>
            </div>
          </motion.div>

          {/* Tile 6: Service Detail (Wide) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-4 bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-black uppercase mb-4">Dịch vụ chuẩn chuyên nghiệp</h4>
              <p className="text-muted-foreground text-sm max-w-sm">
                Chúng tôi không chỉ bán sản phẩm, mà còn cung cấp giải pháp tối ưu cho từng cú đánh của bạn thông qua dịch vụ tư vấn và đan vợt kỹ thuật cao.
              </p>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-lg transition-transform group-hover:-translate-y-2" style={{ transitionDelay: `${i * 50}ms` }}>
                  <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="customer" className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
