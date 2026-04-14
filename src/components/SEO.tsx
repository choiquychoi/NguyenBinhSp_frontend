import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}) => {
  const siteName = 'Nguyễn Bính Sports';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Nguyễn Bính Sports - Chuyên cung cấp dụng cụ thể thao Cầu lông, Pickleball, Tennis chính hãng, uy tín tại Việt Nam.';
  const defaultKeywords = 'cầu lông, pickleball, tennis, vợt cầu lông, giày thể thao, nguyễn bính sports';
  const defaultImage = 'https://scontent.fsgn16-1.fna.fbcdn.net/v/t39.30808-1/250153056_2420750178061878_163732344248490005_n.jpg';
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
};

export default SEO;
