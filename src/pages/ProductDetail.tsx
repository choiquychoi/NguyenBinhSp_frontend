import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '@/context/CartContext';
import CONFIG from '@/lib/config';
import infographic from '@/assets/inforgraphic.png';

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  sku: string;
  mainImage: string;
  gallery: string[];
  specifications: any;
  variants: { size?: string; color?: string; stock: number }[];
  slug: string;
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [activeImg, setActiveImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{ size?: string; color?: string; stock: number } | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CONFIG.API_URL}/products/${slug}`);
        const data = await res.json();
        setProduct(data);
        setActiveImg(data.mainImage);
        
        // Mặc định chọn biến thể đầu tiên còn hàng
        if (data.variants && data.variants.length > 0) {
          const available = data.variants.find((v: any) => v.stock > 0);
          if (available) setSelectedVariant(available);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-red-600 animate-pulse">Đang tải siêu phẩm...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Không tìm thấy sản phẩm!</div>;

  const discountPercentage = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const getVariantLabel = (v: any) => `${v.size || ''}${v.color ? (v.size ? ' - ' : '') + v.color : ''}`;

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert('Vui lòng chọn phân loại sản phẩm!');
      return;
    }
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.mainImage,
      category: product.category,
      slug: product.slug,
      variantLabel: selectedVariant ? getVariantLabel(selectedVariant) : undefined
    }, quantity);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert('Vui lòng chọn phân loại sản phẩm!');
      return;
    }
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={`${product.name} - ${product.category}`}
        description={`${product.name} chính hãng từ ${product.brand}. ${product.description.substring(0, 150)}...`}
        keywords={`${product.name}, ${product.brand}, ${product.category}, Nguyễn Bính Sports`}
        image={product.mainImage}
        type="product"
      />
      <Navbar />
      
      <section className="bg-white pt-20">
        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to={`/category/${product.category}`} className="hover:text-red-600 transition-colors">{product.category}</Link>
            <ChevronRight size={14} />
            <span className="text-red-600 truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Cột trái: Hình ảnh */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl group bg-white">
                <img src={activeImg} alt={product.name} className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110" />
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
              <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
                {[product.mainImage, ...product.gallery].map((img, idx) => (
                  <button 
                    key={idx} onClick={() => setActiveImg(img)}
                    className={`flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? 'border-red-600 scale-95 shadow-lg' : 'border-gray-50 hover:border-gray-200'}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-2 bg-white" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">{product.brand}</div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter uppercase">{product.name}</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Mã sản phẩm: <span className="text-gray-900">{product.sku}</span></p>
              </div>

              <div className="flex items-end space-x-4 py-6 border-y border-gray-50">
                <div className="text-4xl font-black text-red-600">{(product.salePrice || product.price).toLocaleString()}đ</div>
                {product.salePrice && <div className="text-xl font-bold text-gray-300 line-through mb-1">{product.price.toLocaleString()}đ</div>}
              </div>

              {/* CHỌN BIẾN THỂ */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Chọn phân loại:</span>
                    {selectedVariant && (
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                        Còn lại: {selectedVariant.stock} sản phẩm
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, idx) => {
                      const label = getVariantLabel(v);
                      const isSelected = selectedVariant && getVariantLabel(selectedVariant) === label;
                      const isOutOfStock = v.stock <= 0;

                      return (
                        <button
                          key={idx}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 
                            ${isSelected ? 'border-red-600 bg-red-50 text-red-600 shadow-lg shadow-red-100' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}
                            ${isOutOfStock ? 'opacity-30 cursor-not-allowed border-dashed' : 'cursor-pointer'}
                          `}
                        >
                          {label} {isOutOfStock && '(Hết)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Số lượng:</span>
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-red-600 transition-colors font-bold text-xl px-3">-</button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-red-600 transition-colors font-bold text-xl px-3">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-all active:scale-95 group"
                  >
                    <ShoppingCart size={20} className="mr-2 group-hover:rotate-12 transition-transform" /> 
                    Thêm vào giỏ
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center shadow-2xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                  >
                    <Zap size={20} className="mr-2" /> 
                    Mua ngay
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50/30 rounded-3xl border border-blue-50">
                  <ShieldCheck className="text-blue-600 mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase leading-tight">Chính hãng 100%</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-green-50/30 rounded-3xl border border-green-50">
                  <Truck className="text-green-600 mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase leading-tight">Giao hàng hỏa tốc</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-orange-50/30 rounded-3xl border border-orange-50">
                  <RefreshCw className="text-orange-600 mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase leading-tight">7 ngày đổi trả</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Phần mô tả & thông số */}
      <section className="bg-slate-50/50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-12 mb-16">
            <button onClick={() => setShowSpecs(false)} className={`pb-4 text-xs font-black uppercase tracking-[0.4em] transition-all border-b-4 ${!showSpecs ? 'border-red-600 text-red-600' : 'border-transparent text-gray-300 hover:text-gray-400'}`}>Mô tả sản phẩm</button>
            <button onClick={() => setShowSpecs(true)} className={`pb-4 text-xs font-black uppercase tracking-[0.4em] transition-all border-b-4 ${showSpecs ? 'border-red-600 text-red-600' : 'border-transparent text-gray-300 hover:text-gray-400'}`}>Thông số kỹ thuật</button>
          </div>

          <div className="max-w-4xl mx-auto">
            {!showSpecs ? (
              <div className="relative bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-100">
                <div className={`prose prose-red max-w-none text-gray-600 leading-relaxed font-medium transition-all duration-700 overflow-hidden ${!isExpanded ? 'max-h-[500px]' : 'max-h-[10000px]'}`}>
                  <p className="whitespace-pre-line text-lg">{product.description}</p>
                </div>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-10 rounded-b-[3rem]">
                    <button onClick={() => setIsExpanded(true)} className="bg-gray-950 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-2xl">Xem toàn bộ mô tả</button>
                  </div>
                )}
                {isExpanded && <button onClick={() => setIsExpanded(false)} className="mt-12 block mx-auto text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-red-600 transition-colors underline underline-offset-8">Thu gọn nội dung</button>}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="bg-gray-950 p-6 flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Engineered Specifications</span>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {(() => {
                    let specsToDisplay: any = {};
                    const specs = product.specifications || {};
                    if (product.category === 'Cầu lông') specsToDisplay = specs.badminton || {};
                    else if (product.category === 'Pickleball') specsToDisplay = specs.pickleball || {};
                    else if (product.category === 'Tennis') specsToDisplay = specs.tennis || {};
                    else if (product.category === 'Giày Thể Thao') specsToDisplay = specs.shoes || {};

                    const entries = Object.entries(specsToDisplay);
                    if (entries.length === 0) return <p className="col-span-2 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Không có thông số kỹ thuật chi tiết.</p>;

                    return entries.map(([key, value]) => {
                      if (!value) return null;
                      const labels: any = { 
                        weightGrip: 'Trọng lượng / Cán', 
                        balance: 'Độ cân bằng', 
                        maxTension: 'Mức căng tối đa',
                        surface: 'Mặt vợt',
                        core: 'Lõi vợt',
                        technology: 'Công nghệ',
                        origin: 'Xuất xứ'
                      };
                      return (
                        <div key={key} className="group border-b border-gray-50 pb-4">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{labels[key] || key}</div>
                          <div className="text-sm font-bold text-gray-950">{String(value)}</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TẤM ẢNH INFOGRAPHIC THƯƠNG HIỆU - ĐÃ PHÌNH TO */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 group"
          >
            <img 
              src={infographic} 
              alt="Nguyễn Bính Sports Infographic" 
              className="w-full h-auto transition-transform duration-1000 group-hover:scale-105"
            />
          </motion.div>
          <p className="text-center mt-8 text-[11px] font-black uppercase tracking-[0.5em] text-gray-200">
            Professional Equipment — Authentic Quality
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
