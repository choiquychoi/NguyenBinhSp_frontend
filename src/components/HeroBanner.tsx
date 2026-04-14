import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  const slides = [
    {
      id: 1,
      image: 'https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/566355824_1400545665405331_1439950902153017502_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=Om_g5iA5UpYQ7kNvwHvGWOn&_nc_oc=AdogLscOI72ZCNYOeWGj7wbeS4IKcAPUwfGWDiwNLQEVkSJDaNPpVkGw02Ep55Pf220&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=M7qjPklOovSCA2if3v_XPg&_nc_ss=7a3a8&oh=00_Af2ifMIJgUuMf6yX3J17HPngzHNZ2Wrv-nF_6F9wlNVGCw&oe=69E3C5FA',
      title: 'CHINH PHỤC ĐỈNH CAO',
      subtitle: 'Trang bị ngay những siêu phẩm cầu lông mới nhất 2026',
      buttonText: 'MUA NGAY',
    },
    {
      id: 2,
      image: 'https://joola.com.vn/images/1539/thumbs/joola-vision-1920x850xcrop.webp?1920',
      title: 'KỶ NGUYÊN PICKLEBALL',
      subtitle: 'Đẳng cấp và tốc độ với bộ sưu tập của Nguyễn Bính Sports',
      buttonText: 'KHÁM PHÁ',
    },
    {
      id: 3,
      image: 'https://tuanhanhsports.vn/wp-content/uploads/2016/03/slider-1-1371x533.jpg',
      title: 'BƯỚC CHÂN THẦN TỐC',
      subtitle: 'Êm ái và bám sân tuyệt đối với Yonex Power Cushion',
      buttonText: 'XEM CHI TIẾT',
    }
  ];

  return (
    <section className="h-screen w-full relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ 
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !w-3 !h-3 !bg-white/50 !opacity-100 [&.swiper-pagination-bullet-active]:!bg-destructive [&.swiper-pagination-bullet-active]:!w-8 [&.swiper-pagination-bullet-active]:!rounded-full transition-all duration-300"></span>`;
          }
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full [&_.swiper-button-next]:!text-white [&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:after:!text-2xl [&_.swiper-button-prev]:after:!text-2xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="w-full h-full relative flex items-center bg-zinc-900">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear"
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="container mx-auto px-4 relative z-10 pt-20">
                  <div className="max-width-[700px] text-white">
                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9] drop-shadow-2xl"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg md:text-xl font-medium mb-10 max-w-xl opacity-90 drop-shadow-lg"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-destructive hover:bg-destructive/90 text-white font-black text-base px-10 py-7 uppercase tracking-[2px] transition-all hover:translate-y-[-4px] hover:shadow-[0_10px_20px_rgba(212,0,0,0.4)]"
                      >
                        {slide.buttonText}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;
