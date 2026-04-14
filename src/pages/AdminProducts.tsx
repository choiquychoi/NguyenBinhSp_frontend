import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Package, X, Save, Info, Settings, Database, Image as ImageIcon, Activity, Search, Filter, ArrowUpDown } from 'lucide-react';
import CONFIG from '@/lib/config';

interface IVariant {
  size?: string;
  color?: string;
  stock: number;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: 'Cầu lông' | 'Pickleball' | 'Tennis' | 'Dây Đan Vợt' | 'Giày Thể Thao' | 'Phụ Kiện';
  brand: string;
  sku: string;
  status: 'Còn hàng' | 'Hết hàng' | 'Ngừng kinh doanh';
  specifications: {
    badminton?: any;
    pickleball?: any;
    tennis?: any;
    shoes?: any;
  };
  mainImage: string;
  gallery: string[];
  variants: IVariant[];
  lowStockAlert: number;
  isFeatured: boolean;
  isFocus: boolean;
  isActive: boolean;
  slug: string;
}

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search (Xử lý tại Backend)
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  // State UI
  const [activeTab, setActiveTab] = useState('basic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [formError, setFormError] = useState('');

  const categories = ['Cầu lông', 'Pickleball', 'Tennis', 'Dây Đan Vợt', 'Giày Thể Thao', 'Phụ Kiện'];

  const initialFormState = {
    name: '', description: '', price: 0, salePrice: 0, category: 'Cầu lông' as any,
    brand: '', sku: '', status: 'Còn hàng' as any,
    specifications: {
      badminton: { weightGrip: '', balance: '', maxTension: '', frameThickness: '', shaftDiameter: '', frameMaterial: '', shaftMaterial: '', length: '', color: '', origin: '' },
      pickleball: { surface: '', core: '', upaACert: false, usapCert: false, warranty: '', shape: '', length: '', width: '', handleType: '', handleLength: '', handleCircumference: '' },
      tennis: { weight: '', headSize: '', stringPattern: '', gripSize: '', balancePoint: '', frameLength: '', material: '', balanceType: '' }
    },
    mainImage: '', gallery: [''], variants: [{ size: '', color: '', stock: 0 }],
    lowStockAlert: 10, isFeatured: false, isFocus: false, isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${CONFIG.API_URL}/products?page=${page}&limit=10&isAdmin=true&sort=${sort}`;
      if (keyword) url += `&keyword=${keyword}`;
      if (category) url += `&category=${category}`;

      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi Filter hoặc Page thay đổi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce 500ms để tránh gọi API liên tục khi gõ search

    return () => clearTimeout(delayDebounceFn);
  }, [page, keyword, category, sort]);

  const handleUnauthorized = () => {
    localStorage.removeItem('adminToken');
    alert('Phiên đăng nhập hết hạn.');
    navigate('/admin/login');
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormError('');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleEditClick = (product: IProduct) => {
    setEditingProduct(product);
    setFormData({
      ...initialFormState,
      ...product,
      gallery: product.gallery && product.gallery.length > 0 ? product.gallery : [''],
      variants: product.variants && product.variants.length > 0 ? product.variants : [{ size: '', color: '', stock: 0 }]
    });
    setFormError('');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${CONFIG.API_URL}/admin/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) handleUnauthorized();
        if (response.ok) fetchProducts();
      } catch (error) { alert('Lỗi khi xóa'); }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingProduct ? `${CONFIG.API_URL}/admin/products/${editingProduct._id}` : `${CONFIG.API_URL}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      sku: formData.sku?.trim(),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cleanedData),
      });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lỗi lưu');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) { setFormError(err.message); }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* HEADER & ACTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter text-red-600 italic">Quản lý kho</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Tổng cộng: {products.length} sản phẩm trên trang này</p>
        </div>
        <button onClick={handleAddClick} className="bg-black hover:bg-gray-800 text-white px-10 py-5 rounded-[2.5rem] flex items-center transition-all shadow-2xl font-black uppercase tracking-widest text-[10px] active:scale-95">
          <Plus className="w-5 h-5 mr-2 text-red-600" /> Thêm sản phẩm mới
        </button>
      </div>

      {/* SEARCH & FILTER BAR (NEW) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, thương hiệu hoặc SKU..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-xs font-bold outline-none focus:ring-2 focus:ring-red-600 transition-all"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <select 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-red-600"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <select 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-red-600"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sản phẩm</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-8 py-32 text-center text-red-600 animate-pulse font-black uppercase tracking-[0.3em]">Đang tìm kiếm...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={3} className="px-8 py-32 text-center text-gray-300 font-bold italic">Không tìm thấy sản phẩm nào phù hợp yêu cầu.</td></tr>
            ) : products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/80 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img src={product.mainImage} className="w-20 h-20 rounded-[2rem] object-cover border border-gray-100 shadow-md transition-transform group-hover:scale-110" alt="" />
                      {!product.isActive && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-[2rem] text-[8px] font-black text-red-600 uppercase tracking-tighter">Đã ẩn</div>}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">{product.brand}</div>
                      <div className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-lg uppercase tracking-tighter leading-tight">{product.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1">Mã: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-black text-gray-900">{product.price.toLocaleString()}đ</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${product.isActive ? 'text-green-500' : 'text-gray-300'}`}>
                      {product.isActive ? '● Đang hiển thị' : '○ Đang ẩn'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleEditClick(product)} className="p-4 text-blue-600 hover:bg-white hover:shadow-lg rounded-[1.5rem] transition-all"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(product._id)} className="p-4 text-red-600 hover:bg-white hover:shadow-lg rounded-[1.5rem] transition-all"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* PHÂN TRANG */}
        <div className="p-10 bg-gray-50/30 border-t flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Trang {page} / {pages}
          <div className="flex space-x-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-4 bg-white border border-gray-100 rounded-[1.5rem] disabled:opacity-30 shadow-sm hover:shadow-xl transition-all"><ChevronLeft size={20} /></button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-4 bg-white border border-gray-100 rounded-[1.5rem] disabled:opacity-30 shadow-sm hover:shadow-xl transition-all"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* MODAL FORM (Giữ nguyên logic bên trong) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-[3rem] max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
            <div className="p-10 border-b flex justify-between items-center bg-white">
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{editingProduct ? 'Cập Nhật Sản Phẩm' : 'Đăng Sản Phẩm Mới'}</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest italic">Hệ thống quản trị kho hàng chuyên nghiệp</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-[1.5rem] transition-all"><X size={24} /></button>
            </div>

            <div className="flex px-10 bg-white border-b overflow-x-auto no-scrollbar">
              {[
                { id: 'basic', label: 'Thông tin chung', icon: Info },
                { id: 'specs', label: 'Kỹ thuật', icon: Settings },
                { id: 'inventory', label: 'Biến thể', icon: Database },
                { id: 'images', label: 'Hình ảnh', icon: ImageIcon },
                { id: 'status', label: 'Hiển thị', icon: Activity },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-red-600 text-red-600 bg-red-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <tab.icon size={16} className="mr-2" /> {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gray-50/30">
              {formError && <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center shadow-sm"><X size={16} className="mr-3" /> {formError}</div>}

              {activeTab === 'basic' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tên sản phẩm</label><input type="text" required className="form-input-custom" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Yonex Astrox 100ZZ" /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mã SKU (Tự động)</label><input type="text" className="form-input-custom bg-gray-100/50" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Hệ thống tự tạo..." /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thương hiệu</label><input type="text" required className="form-input-custom" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Yonex, Wilson..." /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Danh mục</label>
                      <select className="form-input-custom font-black uppercase text-xs" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Giá niêm yết</label><input type="number" required className="form-input-custom font-black text-red-600" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Giá khuyến mãi</label><input type="number" className="form-input-custom font-black text-green-600" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} /></div>
                  </div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mô tả sản phẩm</label><textarea rows={6} required className="form-input-custom" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  {formData.category === 'Cầu lông' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'Trọng lượng / Cán', key: 'weightGrip' }, { label: 'Độ cân bằng', key: 'balance' },
                        { label: 'Mức căng tối đa', key: 'maxTension' }, { label: 'Độ dày khung', key: 'frameThickness' },
                        { label: 'Đường kính đũa', key: 'shaftDiameter' }, { label: 'Vật liệu khung', key: 'frameMaterial' },
                        { label: 'Vật liệu đũa', key: 'shaftMaterial' }, { label: 'Chiều dài', key: 'length' },
                        { label: 'Màu sắc', key: 'color' }, { label: 'Xuất xứ', key: 'origin' },
                      ].map(f => (
                        <div key={f.key} className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{f.label}</label>
                          <input type="text" className="form-input-custom text-sm" value={(formData.specifications.badminton as any)?.[f.key] || ''} 
                            onChange={e => setFormData({...formData, specifications: {...formData.specifications, badminton: { ...formData.specifications.badminton as any, [f.key]: e.target.value }}})} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : formData.category === 'Pickleball' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'Bề mặt', key: 'surface' }, { label: 'Cốt lõi', key: 'core' },
                        { label: 'Bảo hành', key: 'warranty' }, { label: 'Hình dáng', key: 'shape' },
                        { label: 'Dài', key: 'length' }, { label: 'Rộng', key: 'width' },
                        { label: 'Loại tay cầm', key: 'handleType' }, { label: 'Dài tay cầm', key: 'handleLength' },
                        { label: 'Chu vi tay cầm', key: 'handleCircumference' },
                      ].map(f => (
                        <div key={f.key} className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{f.label}</label>
                          <input type="text" className="form-input-custom text-sm" value={(formData.specifications.pickleball as any)?.[f.key] || ''} 
                            onChange={e => setFormData({...formData, specifications: {...formData.specifications, pickleball: { ...formData.specifications.pickleball as any, [f.key]: e.target.value }}})} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : formData.category === 'Tennis' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'Trọng lượng (gram)', key: 'weight' }, { label: 'Kích thước đầu vợt', key: 'headSize' },
                        { label: 'Mẫu dây', key: 'stringPattern' }, { label: 'Cán vợt', key: 'gripSize' },
                        { label: 'Điểm cân bằng', key: 'balancePoint' }, { label: 'Chiều dài khung', key: 'frameLength' },
                        { label: 'Chất liệu', key: 'material' }, { label: 'Loại cân bằng (HL/HH)', key: 'balanceType' },
                      ].map(f => (
                        <div key={f.key} className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{f.label}</label>
                          <input type="text" className="form-input-custom text-sm" value={(formData.specifications.tennis as any)?.[f.key] || ''} 
                            onChange={e => setFormData({...formData, specifications: {...formData.specifications, tennis: { ...formData.specifications.tennis as any, [f.key]: e.target.value }}})} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : formData.category === 'Giày Thể Thao' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'Màu sắc', key: 'color' }, { label: 'Xuất xứ', key: 'origin' },
                        { label: 'Công nghệ', key: 'technology' }, { label: 'Chất liệu đế', key: 'soleMaterial' },
                        { label: 'Chất liệu thân giày', key: 'upperMaterial' },
                      ].map(f => (
                        <div key={f.key} className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{f.label}</label>
                          <input type="text" className="form-input-custom text-sm" value={(formData.specifications.shoes as any)?.[f.key] || ''} 
                            onChange={e => setFormData({...formData, specifications: {...formData.specifications, shoes: { ...formData.specifications.shoes as any, [f.key]: e.target.value }}})} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 uppercase text-[10px] font-black text-gray-300 tracking-[0.3em]">Thông số chung</div>
                  )}
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center bg-black p-8 rounded-[2rem] text-white shadow-xl shadow-gray-200">
                    <div><h4 className="font-black uppercase tracking-tighter text-lg">Biến thể kho hàng</h4><p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Phân loại theo Size và Màu sắc</p></div>
                    <button type="button" onClick={() => setFormData({...formData, variants: [...formData.variants, { size: '', color: '', stock: 0 }]})} className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Thêm dòng</button>
                  </div>
                  <div className="space-y-4">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="flex gap-6 items-end bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-red-100 transition-all">
                        <div className="flex-1 space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kích cỡ</label><input type="text" className="form-input-custom text-sm" value={v.size} onChange={e => { const nv = [...formData.variants]; nv[i].size = e.target.value; setFormData({...formData, variants: nv}) }} /></div>
                        <div className="flex-1 space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Màu sắc</label><input type="text" className="form-input-custom text-sm" value={v.color} onChange={e => { const nv = [...formData.variants]; nv[i].color = e.target.value; setFormData({...formData, variants: nv}) }} /></div>
                        <div className="w-40 space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số lượng</label><input type="number" className="form-input-custom text-sm font-black text-red-600" value={v.stock} onChange={e => { const nv = [...formData.variants]; nv[i].stock = Number(e.target.value); setFormData({...formData, variants: nv}) }} /></div>
                        <button type="button" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx) => idx !== i)})} className="p-4 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ảnh đại diện (URL)</label><input type="text" required className="form-input-custom" value={formData.mainImage} onChange={e => setFormData({...formData, mainImage: e.target.value})} /></div>
                  <div className="pt-10 border-t space-y-6">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bộ sưu tập ảnh</label><button type="button" onClick={() => setFormData({...formData, gallery: [...formData.gallery, '']})} className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4">Thêm ảnh mới</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.gallery.map((g, i) => (
                        <div key={i} className="flex gap-3"><input type="text" className="form-input-custom text-xs" value={g} onChange={e => { const ng = [...formData.gallery]; ng[i] = e.target.value; setFormData({...formData, gallery: ng}) }} /><button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})} className="p-4 text-red-400 hover:text-red-600 transition-all"><X size={18} /></button></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'status' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái tồn kho</label>
                      <select className="form-input-custom font-black uppercase text-xs tracking-widest" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                        <option value="Còn hàng">✅ Còn hàng</option>
                        <option value="Hết hàng">❌ Hết hàng</option>
                        <option value="Ngừng kinh doanh">🚫 Ngừng kinh doanh</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                      {[
                        { id: 'isFeatured', label: 'Sản phẩm nổi bật' },
                        { id: 'isFocus', label: 'Sản phẩm tiêu điểm' },
                        { id: 'isActive', label: 'Kích hoạt hiển thị' },
                      ].map(k => (
                        <label key={k.id} className="flex items-center p-6 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100 group">
                          <input type="checkbox" className="w-6 h-6 rounded-lg text-red-600 mr-4 border-gray-300 focus:ring-red-500" checked={(formData as any)[k.id]} onChange={e => setFormData({...formData, [k.id]: e.target.checked})} />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-red-600">{k.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex gap-6 sticky bottom-0 bg-gray-50/80 backdrop-blur-md p-4 rounded-[2rem]">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center">
                  <Save size={24} className="mr-3" /> CẬP NHẬT HỆ THỐNG
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-12 bg-white text-gray-400 hover:text-gray-900 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-50 transition-all">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input-custom { width: 100%; padding: 1.5rem; background: white; border: 1.5px solid #f3f4f6; border-radius: 1.5rem; font-weight: 800; color: #1f2937; outline: none; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .form-input-custom:focus { border-color: #dc2626; box-shadow: 0 15px 30px -10px rgba(220, 38, 38, 0.15); transform: translateY(-2px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminProducts;
