import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'Cầu lông',
      displayName: 'Vợt Cầu Lông',
      image: 'https://images.stockcake.com/public/5/7/4/574335f9-afed-4e4c-9bcc-5a374971eded_large/sunset-badminton-game-stockcake.jpg',
      count: 'Yonex, Victor, Lining'
    },
    {
      id: 2,
      name: 'Pickleball',
      displayName: 'Vợt Pickleball',
      image: 'https://hips.hearstapps.com/hmg-prod/images/ghk-testing-pickleball-paddles-1668457089.png?crop=0.665xw:1.00xh;0.154xw,0&resize=640:*',
      count: 'Joola, Selkirk, Franklin'
    },
    {
      id: 6,
      name: 'Quần áo',
      displayName: 'Quần áo Thể Thao',
      image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600&auto=format&fit=crop',
      count: 'Áo, Quần, Bộ đồ'
    },
    {
      id: 4,
      name: 'Giày Thể Thao',
      displayName: 'Giày Thể Thao',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      count: 'Yonex, Victor, Mizuno'
    },
    {
      id: 5,
      name: 'Phụ Kiện',
      displayName: 'Phụ Kiện',
      image: 'https://vuagym.com/wp-content/uploads/2020/09/15-7-855x450-1.jpg',
      count: 'Túi, Quấn cán, Phụ kiện'
    }
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            Danh Mục <span className="text-destructive">Sản Phẩm</span>
          </h2>
          <div className="h-1.5 w-24 bg-destructive mx-auto rounded-full" />
        </div>
        
        {/* Dùng Flexbox justify-center để 5 món luôn nằm giữa */}
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[500px] w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(18%)] min-w-[240px] overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:shadow-destructive/20 border border-white/10"
            >
              <Link to={`/category/${cat.name}`} className="block w-full h-full">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                
                {/* Gradient Overlay cực chuyên nghiệp */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 group-hover:via-black/40 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 text-white transition-all duration-500 group-hover:pb-12">
                  <h3 className="text-2xl font-black uppercase mb-2 tracking-tighter drop-shadow-2xl">
                    {cat.displayName}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive mb-6 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {cat.count}
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-white text-black border-none font-black uppercase text-[10px] tracking-widest px-8 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-xl active:scale-95"
                  >
                    Khám phá
                  </Button>
                </div>

                {/* Hiệu ứng viền phát sáng khi hover */}
                <div className="absolute inset-0 border-[3px] border-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
