import React from 'react';
import { ShoppingCart, Eye, Package, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatKip } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-[#091b3e]/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-700/40 hover:border-cyan-400 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20 flex flex-col justify-between">
      
      {/* Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-cyan-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-cyan-400/30">
          {product.category}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              ໝົດສະຕັອກ
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" /> ເຫຼືອ {product.stock} {product.unit}
            </span>
          ) : (
            <span className="bg-blue-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow flex items-center gap-1">
              <Package className="w-3 h-3" /> ມີ {product.stock} {product.unit}
            </span>
          )}
        </div>

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4" /> ເບິ່ງຮູບຂະຫຍາຍ
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onSelect(product)}
            className="text-white font-bold text-base leading-snug line-clamp-2 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {product.nameEn && (
            <p className="text-slate-400 text-xs font-english line-clamp-1 mt-0.5">
              {product.nameEn}
            </p>
          )}

          {product.description && (
            <p className="text-blue-200/80 text-xs line-clamp-2 mt-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-blue-900/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 block">ລາຄາ:</span>
              <span className="text-xl font-black text-amber-400 font-english">
                {formatKip(product.price)}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-english">
                {formatKip(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Blue for View Details, Yellow for Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            {/* Blue Button: Product Details */}
            <button
              onClick={() => onSelect(product)}
              className="py-2 px-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow transition-all active:scale-95 cursor-pointer border border-blue-400/40"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ລາຍລະອຽດ</span>
            </button>

            {/* Yellow Button: Add to Cart */}
            <button
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product)}
              className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'ສິນຄ້າໝົດ' : 'ໃສ່ກະຕ່າ'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
