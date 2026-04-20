import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, Filter, ShoppingCart, Eye, ChevronLeft, ArrowUpDown, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CONFIG from '@/lib/config';

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  mainImage: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [availableBrands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Sort
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${CONFIG.API_URL}/products?category=${categoryName}&page=${page}&limit=12&sort=${sort}`;
      if (brand) url += `&brand=${brand}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const { data } = await axios.get(url);
      setProducts(data.products);
      setPages(data.pages);
      if (data.brands) setBrands(data.brands);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName, page, sort, brand]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={`Danh mục ${categoryName}`}
        description={`Khám phá danh sách sản phẩm ${categoryName} chính hãng tại Nguyễn Bính Sports. Chất lượng hàng đầu, giá cả cạnh tranh.`}
        keywords={`${categoryName}, vợt cầu lông, dụng cụ thể thao, Nguyễn Bính Sports`}
      />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-red-600 font-black uppercase">{categoryName}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* CỘT TRÁI: BỘ LỌC (Sidebar) */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase tracking-tighter italic flex items-center">
                  <Filter size={18} className="mr-2 text-red-600" /> Bộ lọc
                </h3>
                {(brand || minPrice || maxPrice) && (
                  <button onClick={clearFilters} className="text-[10px] font-bold text-gray-400 hover:text-red-600 flex items-center uppercase">
                    Xóa hết <X size={12} className="ml-1" />
                  </button>
                )}
              </div>

              {/* Lọc theo Thương hiệu */}
              <div className="space-y-4 pb-8 border-b border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thương hiệu</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <button 
                    onClick={() => setBrand('')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-all ${brand === '' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    Tất cả thương hiệu
                  </button>
                  {availableBrands.map((b) => (
                    <button 
                      key={b}
                      onClick={() => { setBrand(b); setPage(1); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-all ${brand === b ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc theo Giá */}
              <div className="space-y-4 pt-8 pb-8 border-b border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khoảng giá (VNĐ)</h4>
                <form onSubmit={handlePriceApply} className="space-y-3">
                  <input 
                    type="number" placeholder="Từ" 
                    className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold outline-none focus:border-red-600"
                    value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="Đến" 
                    className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold outline-none focus:border-red-600"
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  />
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl">
                    Áp dụng giá
                  </Button>
                </form>
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
          <div className="flex-1">
            {/* Header List & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
                {categoryName}
              </h1>
              
              <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <div className="p-2 bg-white rounded-xl shadow-sm text-red-600">
                  <ArrowUpDown size={16} />
                </div>
                <select 
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none pr-4 cursor-pointer"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="py-32 text-center font-black text-red-600 animate-pulse uppercase tracking-[0.3em]">
                Đang nạp dữ liệu...
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 px-6">
                <p className="text-gray-400 font-black uppercase tracking-widest italic">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={clearFilters} className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest">Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => {
                    const hasSale = product.salePrice && product.salePrice > 0;
                    const discount = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

                    return (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link to={`/product/${product.slug}`}>
                          <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer rounded-[2.5rem]">
                            <CardContent className="p-0 relative aspect-[4/5] overflow-hidden bg-gray-50/50 m-4 rounded-[2rem]">
                              <img src={product.mainImage} alt={product.name} className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" />
                              {discount > 0 && <Badge className="absolute top-4 left-4 bg-red-600 font-black px-3 py-1 rounded-xl shadow-lg border-none text-white">-{discount}%</Badge>}
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <Button size="icon" variant="secondary" className="rounded-full shadow-lg"><Eye size={18} /></Button>
                                <Button size="icon" className="rounded-full bg-red-600 shadow-lg text-white"><ShoppingCart size={18} /></Button>
                              </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center p-6 pt-2 text-center">
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">{product.brand}</span>
                              <h3 className="font-bold text-sm mb-3 line-clamp-1 group-hover:text-red-600 transition-colors uppercase px-2">{product.name}</h3>
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-black text-gray-900 tracking-tighter">{(product.salePrice || product.price).toLocaleString()}đ</span>
                                {hasSale && <span className="text-xs text-gray-300 line-through font-bold">{product.price.toLocaleString()}đ</span>}
                              </div>
                            </CardFooter>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-24 flex items-center justify-center space-x-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all border border-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center space-x-2">
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setPage(x + 1)}
                      className={`w-12 h-12 rounded-2xl font-black text-xs transition-all border ${page === x + 1 ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-100 scale-110' : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-600'}`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all border border-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
