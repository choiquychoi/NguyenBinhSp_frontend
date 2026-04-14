import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import CONFIG from '@/lib/config';

const FocusProduct = () => {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchFocusProduct = async () => {
      try {
        const { data } = await axios.get(`${CONFIG.API_URL}/products`);
        // API mới trả về { products: [...] }, chúng ta cần lấy mảng products ra trước
        const productList = data.products || data;
        const focus = Array.isArray(productList) ? productList.find((p: any) => p.isFocus || p.name.includes('Youlong')) : null;
        
        if (focus) {
          setProduct({
            ...focus,
            name: 'Vợt cầu lông thiên công VS Youlong',
            image: 'https://thegioicaulong.vn/wp-content/uploads/2023/12/youlong-red-1.jpg'
          });
        } else {
          setProduct({
            name: 'Vợt cầu lông thiên công VS Youlong',
            description: 'Siêu phẩm thiên công mạnh mẽ với họa tiết Rồng xanh uốn lượn tinh xảo. Sử dụng sợi Carbon 40T cao cấp từ Nhật Bản, Youlong mang lại những cú smash uy lực và độ ổn định tuyệt đối.',
            image: 'https://thegioicaulong.vn/wp-content/uploads/2023/12/youlong-red-1.jpg',
            price: 1850000
          });
        }
      } catch (error) {
        console.error('Error fetching focus product:', error);
        setProduct({
          name: 'Vợt cầu lông thiên công VS Youlong',
          description: 'Siêu phẩm thiên công mạnh mẽ với họa tiết Rồng xanh uốn lượn tinh xảo. Sử dụng sợi Carbon 40T cao cấp từ Nhật Bản, Youlong mang lại những cú smash uy lực và độ ổn định tuyệt đối.',
          image: 'https://thegioicaulong.vn/wp-content/uploads/2023/12/youlong-red-1.jpg',
          price: 1850000
        });
      }
    };
    fetchFocusProduct();
  }, []);

  if (!product) return null;

  return (
    <section className="relative w-full bg-zinc-950 text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
        {/* Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] lg:h-auto overflow-hidden group"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/20" />
        </motion.div>

        {/* Text Side */}
        <div className="flex items-center justify-center p-8 lg:p-20 bg-zinc-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <Badge className="mb-6 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] bg-destructive hover:bg-destructive text-white border-none rounded-none">
              Siêu phẩm 2026
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
              {product.name}
            </h2>
            
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed font-medium">
              {product.description}
            </p>
            
            <div className="space-y-4 mb-12">
              {[
                "Sợi Carbon 40T cao cấp Nhật Bản",
                "Khung vợt Power Frame tấn công uy lực",
                "Thiết kế Rồng Xanh uốn lượn tinh xảo"
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="h-16 px-12 text-base font-black uppercase tracking-widest bg-white text-black hover:bg-destructive hover:text-white transition-all rounded-none border-none shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_20px_rgba(212,0,0,0.4)]"
            >
              Khám phá chi tiết
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 blur-[120px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/5 blur-[150px] rounded-full -ml-48 -mb-48" />
    </section>
  );
};

export default FocusProduct;
