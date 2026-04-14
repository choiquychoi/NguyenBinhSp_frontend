import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
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
