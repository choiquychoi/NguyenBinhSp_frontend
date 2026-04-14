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
      id: 3,
      name: 'Dây Đan Vợt',
      displayName: 'Dây Đan Vợt',
      image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltkpiac4dlai66',
      count: 'Yonex, Kizuna, Lining'
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
      count: 'Túi, Quấn cán, Chặn mồ hôi'
    }
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter">
          Danh Mục <span className="text-destructive">Sản Phẩm</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[450px] overflow-hidden rounded-xl shadow-lg"
            >
              <Link to={`/category/${cat.name}`} className="block w-full h-full">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-black uppercase mb-2 drop-shadow-md">
                    {cat.displayName}
                  </h3>
                  <p className="text-sm font-medium opacity-90 mb-6 drop-shadow-md">
                    {cat.count}
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold uppercase transition-all opacity-0 group-hover:opacity-100"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
