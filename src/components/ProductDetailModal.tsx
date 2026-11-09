import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, ShoppingCart, Plus, Minus, Tag, Barcode, CheckCircle, Package } from 'lucide-react';
import { Product } from '../types';
import { formatKip } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showAddedNotice, setShowAddedNotice] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const maxAvailable = product.stock;

  const handleIncrease = () => {
    if (quantity < maxAvailable) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setShowAddedNotice(true);
    setTimeout(() => {
      setShowAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Lightbox / Fullscreen Zoom Mode */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Red button for closing zoom */}
            <button
              onClick={() => setIsZoomed(false)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-lg"
            >
              <X className="w-5 h-5" /> ປິດຮູບຂະຫຍາຍ
            </button>
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl transition-transform"
          />
          <p className="mt-3 text-sm text-slate-300">ຄລິກບ່ອນໃດກໍໄດ້ເພື່ອຍຸບຮູບພາບລົງ</p>
        </div>
      )}

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-3xl bg-[#081b3c] border-2 border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right (Red Button) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 border border-rose-300/40 cursor-pointer"
          title="ປິດ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column with Zoom capability */}
        <div className="md:w-1/2 relative bg-slate-950 flex flex-col items-center justify-center min-h-[260px] md:min-h-full p-4 overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full max-h-[360px] object-contain rounded-xl"
          />

          {/* Zoom Trigger (Blue Button) */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-4 right-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xl border border-blue-400/40 active:scale-95 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4 text-cyan-200" />
            <span>ຄລິກຂະຫຍາຍຮູບພາບ</span>
          </button>

          <span className="absolute top-4 left-4 bg-black/70 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-400/30 font-semibold">
            {product.category}
          </span>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.name}
            </h2>
            {product.nameEn && (
              <p className="text-sm text-slate-400 font-english mt-1">
                {product.nameEn}
              </p>
            )}

            {/* Price section */}
            <div className="mt-4 p-3 bg-[#041126] rounded-xl border border-blue-700/50 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">ລາຄາສິນຄ້າ:</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-english">
                  {formatKip(product.price)}
                </span>
                <span className="text-xs text-cyan-300 ml-1">/ {product.unit}</span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 line-through font-english block">
                    {formatKip(product.originalPrice)}
                  </span>
                  <span className="text-[11px] font-bold text-rose-400">
                    ຫຼຸດ {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="p-2 rounded-lg bg-[#061530] border border-blue-900/60 flex items-center gap-1.5 text-slate-300">
                <Package className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ສະຕັອກ: <strong>{product.stock} {product.unit}</strong></span>
              </div>
              {product.barcode && (
                <div className="p-2 rounded-lg bg-[#061530] border border-blue-900/60 flex items-center gap-1.5 text-slate-300">
                  <Barcode className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-english truncate">{product.barcode}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider mb-1">
                ລາຍລະອຽດສິນຄ້າ
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#030d1e]/70 p-3 rounded-xl border border-blue-900/60">
                {product.description || 'ສິນຄ້າຄຸນນະພາບດີ ຮັບປະກັນຄວາມພໍໃຈ ສັ່ງຊື້ໄດ້ທັນທີ'}
              </p>
            </div>
          </div>

          {/* Action section: Quantity & Add to Cart */}
          <div className="mt-6 pt-4 border-t border-blue-900/70">
            {isOutOfStock ? (
              <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-center text-rose-300 font-bold text-sm">
                ຂໍອະໄພ ສິນຄ້ານີ້ໝົດສະຕັອກຊົ່ວຄາວ
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">ເລືອກຈຳນວນ:</span>
                  <div className="flex items-center bg-[#030c1d] border border-blue-600/50 rounded-xl overflow-hidden p-1">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-black text-amber-300 font-english text-base">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= maxAvailable}
                      className="w-8 h-8 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal calculation */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <span>ຍອດລວມລາຍການນີ້:</span>
                  <span className="font-bold text-cyan-300 font-english text-sm">
                    {formatKip(product.price * quantity)}
                  </span>
                </div>

                {/* Buttons: Red for Cancel/Close, Yellow for Add to Cart */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all active:scale-95 border border-rose-400/40 cursor-pointer"
                  >
                    ຍົກເລີກ
                  </button>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={showAddedNotice}
                    className="col-span-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-amber-300 cursor-pointer"
                  >
                    {showAddedNotice ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-800 animate-spin" />
                        <span>ເພີ່ມລົງກະຕ່າແລ້ວ!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 text-slate-950" />
                        <span>ເພີ່ມລົງກະຕ່າ ({formatKip(product.price * quantity)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
