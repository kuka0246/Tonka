import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';
import { formatKip } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#071633] border-l-2 border-cyan-400/50 shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header (Space Sky Blue Bar) */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-4 flex items-center justify-between text-slate-950 shadow-lg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-slate-950" />
              <div>
                <h3 className="font-black text-lg text-slate-950 leading-tight">
                  ກະຕ່າສິນຄ້າຂອງທ່ານ
                </h3>
                <span className="text-xs font-bold text-slate-900">
                  ມີທັງໝົດ {totalItemsCount} ລາຍການ
                </span>
              </div>
            </div>

            {/* Red Button to Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-all border border-rose-300/40 cursor-pointer"
              title="ປິດກະຕ່າ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-blue-950/80 border border-blue-700/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  ຍັງບໍ່ມີສິນຄ້າໃນກະຕ່າ
                </h4>
                <p className="text-xs text-slate-400 mb-6">
                  ເລືອກສິນຄ້າທີ່ທ່ານຕ້ອງການແລ້ວກົດ "ເພີ່ມລົງກະຕ່າ"
                </p>
                {/* Blue Button to Continue Shopping */}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  ເລືອກຊື້ສິນຄ້າດຽວນີ້
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-blue-900/60">
                  <span>ລາຍການທີ່ເລືອກໄວ້:</span>
                  {/* Red Button: Clear cart */}
                  <button
                    onClick={onClearCart}
                    className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ລ້າງກະຕ່າທັງໝົດ</span>
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-[#051329] border border-blue-800/50 rounded-2xl flex gap-3 items-center justify-between shadow-md"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-blue-900/60 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-amber-400 font-black font-english mt-0.5">
                        {formatKip(item.product.price)}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-[#020a1c] border border-blue-600/50 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-blue-950 hover:bg-blue-800 text-white flex items-center justify-center text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-amber-300 font-english">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity < item.product.stock) {
                                onUpdateQuantity(item.product.id, item.quantity + 1);
                              }
                            }}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded bg-blue-950 hover:bg-blue-800 text-white flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {item.product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Total & Delete Button (Red) */}
                    <div className="flex flex-col items-end justify-between self-stretch">
                      {/* Red Button: Remove item */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title="ລົບອອກ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">ລວມ:</div>
                        <div className="text-xs font-bold text-cyan-300 font-english">
                          {formatKip(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-4 bg-[#030e22] border-t-2 border-blue-700/60 space-y-3">
              {/* Summary Details */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>ຍອດລວມສິນຄ້າ (Subtotal):</span>
                  <span className="font-bold text-white font-english">{formatKip(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ຄ່າຈັດສົ່ງ (Delivery Fee):</span>
                  <span className="font-bold text-cyan-400">ຟຣີ (ໂປຣໂມຊັ່ນ)</span>
                </div>
                <div className="pt-2 border-t border-blue-900 flex justify-between items-baseline">
                  <span className="text-sm font-black text-white">ຍອດເງິນທີ່ຕ້ອງຊຳລະທັງໝົດ:</span>
                  <span className="text-2xl font-black text-amber-400 font-english">
                    {formatKip(subtotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Blue to continue, Yellow to Proceed */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {/* Blue Button: Continue shopping */}
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border border-blue-400/40 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ເລືອກສິນຄ້າຕໍ່</span>
                </button>

                {/* Yellow Button: Proceed to Checkout */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="py-3 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-xl active:scale-95 transition-all border-2 border-amber-300 cursor-pointer"
                >
                  <span>ສັ່ງຊື້ສິນຄ້າ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
