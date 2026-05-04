import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  slug: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('tam_hi_sports_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('tam_hi_sports_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item._id === product._id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
      );

      if (existingItem) {
        return prevCart.map(item =>
          (item._id === product._id && 
           item.selectedSize === product.selectedSize && 
           item.selectedColor === product.selectedColor)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.image,
        category: product.category,
        slug: product.slug,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor,
        quantity: quantity
      }];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        (item._id === productId && item.selectedSize === size && item.selectedColor === color) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
