import React from 'react';
import { CheckCircle, Printer, ShoppingBag, MapPin, Phone, CreditCard, Clock, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { formatKip, formatDateLao, getStatusLabel } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onPrintReceipt: (order: Order) => void;
  onTrackOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onPrintReceipt,
  onTrackOrder
}) => {
  if (!order) return null;

  const statusInfo = getStatusLabel(order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#071633] border-2 border-blue-500/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Success Banner (Space Sky Blue Bar) */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-6 text-slate-950 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-950 text-cyan-300 flex items-center justify-center shadow-xl mb-3 border-2 border-cyan-300">
            <CheckCircle className="w-10 h-10 text-cyan-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-950 leading-tight">
            ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ!
          </h2>
          <p className="text-xs font-bold text-slate-900 mt-1">
            ຂອບໃຈທີ່ໃຊ້ບໍລິການ POS Lao Space Blue
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 text-left text-sm">
          {/* Order ID Badge */}
          <div className="p-3 bg-[#041126] border border-blue-800/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">ລະຫັດອໍເດີ້ (Order ID):</span>
              <span className="text-lg font-black text-amber-400 font-english">
                #{order.id}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.textCol} ${statusInfo.border}`}>
              {statusInfo.text}
            </div>
          </div>

          {/* Info Summary */}
          <div className="space-y-2 text-xs text-slate-300 bg-[#05142e] p-4 rounded-2xl border border-blue-900/60">
            <div className="flex justify-between items-center py-1 border-b border-blue-950/60">
              <span className="text-slate-400">ຊື່ລູກຄ້າ:</span>
              <span className="font-bold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-blue-950/60">
              <span className="text-slate-400">ເບີໂທ:</span>
              <span className="font-bold text-white font-english">{order.phone}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-blue-950/60">
              <span className="text-slate-400">ວິທີຊຳລະເງິນ:</span>
              <span className="font-bold text-cyan-300">
                {order.paymentMethod === 'COD' ? 'ຈ່າຍເງິນສົດປາຍທາງ (COD)' : 'ໂອນຜ່ານ QR Code ທະນາຄານ'}
              </span>
            </div>
            <div className="py-1">
              <span className="text-slate-400 block mb-0.5">ທີ່ຢູ່ຈັດສົ່ງ:</span>
              <span className="text-white block font-medium">{order.address}</span>
            </div>

            {order.location && (
              <div className="pt-2 border-t border-blue-950/60 flex items-center justify-between">
                <span className="text-[11px] text-cyan-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> ປັກໝຸດ GPS ຮຽບຮ້ອຍ
                </span>
                <a
                  href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                >
                  <span>ເປີດ Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="p-3 bg-[#041126] rounded-2xl border border-blue-800/60 flex items-baseline justify-between">
            <span className="font-bold text-slate-300">ຍອດເງິນລວມທັງໝົດ:</span>
            <span className="text-2xl font-black text-amber-400 font-english">
              {formatKip(order.totalAmount)}
            </span>
          </div>

          {/* Action Buttons: Blue, Red, Yellow */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Blue Button: Print Receipt */}
              <button
                type="button"
                onClick={() => onPrintReceipt(order)}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-blue-400/40"
              >
                <Printer className="w-4 h-4" />
                <span>ພິມໃບບິນ POS</span>
              </button>

              {/* Blue Button: Track order */}
              <button
                type="button"
                onClick={onTrackOrder}
                className="py-2.5 px-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-blue-400/40"
              >
                <Clock className="w-4 h-4" />
                <span>ຕິດຕາມສະຖານະ</span>
              </button>
            </div>

            {/* Yellow Button: Continue Shopping */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg active:scale-95 transition-all border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ເລືອກຊື້ສິນຄ້າເພີ່ມເຕີມ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
