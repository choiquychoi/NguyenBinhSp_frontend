import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from '@/context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Click outside to close search
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Live Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoading(true);
        try {
          const { data } = await axios.get(`http://localhost:5005/api/products?keyword=${searchQuery}&limit=5`);
          setSearchResults(data.products);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const navLinks = [
    { name: "Cầu Lông", path: "/category/Cầu lông" },
    { name: "Pickleball", path: "/category/Pickleball" },
    { name: "Tennis", path: "/category/Tennis" },
    { name: "Dây Đan", path: "/category/Dây Đan Vợt" },
    { name: "Giày", path: "/category/Giày Thể Thao" },
    { name: "Phụ Kiện", path: "/category/Phụ Kiện" },
    { name: "Tin tức", path: "/news" },
    { name: "Liên Hệ", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full h-20 flex items-center z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
        : "bg-background border-b"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-destructive group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <img 
                src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/250153056_2420750178061878_163732344248490005_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=4LcxbQxebmYQ7kNvwGnlTcP&_nc_oc=AdqyY5Zrf3vGW74Lq5BJ5a0unWs_G_rgiBbVQCTx71XDUXiqap0T08UOuqoceom3Mw0&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=SmN8yB_q2GCTRcE4yJPWqQ&_nc_ss=7a3a8&oh=00_Af3StnTdpZLmx3rCB2E74f0ekvz4NkkzWwy7AX4jHeP0GA&oe=69E3C806" 
                alt="Logo Nguyễn Bính Sports" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black uppercase tracking-tighter text-destructive">NguyễnBính</span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">Sports</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:block">
          {!isSearchOpen ? (
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-[11px] font-black uppercase tracking-widest hover:text-destructive transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div ref={searchRef} className="relative w-[400px] animate-in slide-in-from-right-4 duration-300">
              <Input
                autoFocus
                placeholder="Tìm kiếm vợt, giày, phụ kiện..."
                className="rounded-full border-2 border-destructive focus-visible:ring-0 h-10 px-6 pr-10 bg-white text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <X 
                className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400 cursor-pointer hover:text-destructive" 
                onClick={() => {setIsSearchOpen(false); setSearchQuery('');}}
              />

              {/* Search Results Dropdown */}
              {(searchResults.length > 0 || isLoading) && (
                <div className="absolute top-12 left-0 w-full bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-[60]">
                  {isLoading ? (
                    <div className="p-4 flex items-center justify-center text-zinc-400">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Đang tìm kiếm...</span>
                    </div>
                  ) : (
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          onClick={() => handleProductClick(product.slug)}
                          className="flex items-center gap-4 p-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors text-black"
                        >
                          <img src={product.mainImage} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-destructive tracking-widest leading-none mb-1">{product.brand}</span>
                            <span className="text-xs font-black uppercase tracking-tighter line-clamp-1">{product.name}</span>
                            <span className="text-[10px] font-bold text-zinc-400">{product.price.toLocaleString('vi-VN')}₫</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {!isSearchOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex hover:bg-destructive/5 hover:text-destructive transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-destructive text-white border-none">
                  {getItemCount()}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-2xl font-black uppercase tracking-tighter mb-8">
                    <span className="text-destructive">NguyễnBính</span>
                    <span className="text-green-600 dark:text-green-500">Sports</span>
                  </SheetTitle>
                </SheetHeader>
                {/* Mobile Search */}
                <div className="mb-8">
                  <Input 
                    placeholder="Tìm kiếm..." 
                    className="rounded-full border-2 border-destructive"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          onClick={() => handleProductClick(product.slug)}
                          className="flex items-center gap-4 p-2"
                        >
                          <img src={product.mainImage} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-tighter">{product.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <nav className="flex flex-col gap-6 mt-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      to={link.path} 
                      className="text-lg font-black uppercase tracking-widest hover:text-destructive transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
