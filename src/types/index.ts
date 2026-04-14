export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  isFeatured: boolean;
  isFocus?: boolean;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  count: string;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export interface Stat {
  number: string;
  label: string;
}
