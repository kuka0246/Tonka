import React from 'react';
import { X, Printer, CheckCircle, Store, MapPin } from 'lucide-react';
import { Order } from '../types';
import { formatKip, formatDateLao } from '../utils/formatters';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Header bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-4 text-slate-950 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-950" />
            <span className="font-bold text-sm">ໃບບິນຮັບເງິນ POS (Receipt)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Blue Button: Print */}
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ພິມໃບບິນ</span>
            </button>
            {/* Red Button: Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center shadow cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Receipt Body */}
        <div className="p-6 font-mono text-xs space-y-4 bg-[#fafafa]">
          {/* Store Logo & Info */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4">
            <h1 className="text-xl font-black font-english text-slate-950 tracking-wider">
              POS LAO STORE
            </h1>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              ລະບົບຂາຍສິນຄ້າ ແລະ ຈັດສົ່ງອອນໄລ
            </p>
            <p className="text-[11px] text-slate-500">
              ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ &bull; ໂທ: 020 5566 7788
            </p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-1 text-[11px] border-b-2 border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">ເລກທີໃບບິນ:</span>
              <span className="font-bold text-slate-900 font-english">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ວັນທີ-ເວລາ:</span>
              <span className="text-slate-800">{formatDateLao(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ລູກຄ້າ:</span>
              <span className="font-bold text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ເບີໂທ:</span>
              <span className="font-english text-slate-900">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ການຊຳລະ:</span>
              <span className="font-bold text-slate-900">
                {order.paymentMethod === 'COD' ? 'ຈ່າຍເງິນສົດປາຍທາງ (COD)' : 'ໂອນຜ່ານ QR Code ທະນາຄານ'}
              </span>
            </div>
            {order.address && (
              <div className="pt-1 text-[10px] text-slate-600 line-clamp-2">
                <strong>ທີ່ຢູ່:</strong> {order.address}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="border-b-2 border-dashed border-slate-300 pb-3">
            <div className="flex justify-between font-bold text-[11px] text-slate-900 pb-1 mb-1 border-b border-slate-200">
              <span className="w-1/2">ລາຍການສິນຄ້າ</span>
              <span className="w-1/6 text-center">ຈຳນວນ</span>
              <span className="w-1/3 text-right">ລວມ (₭)</span>
            </div>
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-slate-800">
                  <span className="w-1/2 truncate font-sans text-xs">{item.productName}</span>
                  <span className="w-1/6 text-center font-english">{item.quantity}</span>
                  <span className="w-1/3 text-right font-bold font-english">
                    {formatKip(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="space-y-1 pt-1 border-b-2 border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">ຍອດລວມ:</span>
              <span className="font-bold font-english">{formatKip(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">ຄ່າຈັດສົ່ງ:</span>
              <span className="font-bold text-emerald-600">0 ₭ (Free)</span>
            </div>
            <div className="flex justify-between text-base font-black pt-1 text-slate-950">
              <span>ຍອດສຸທິ:</span>
              <span className="font-english text-lg text-orange-600">
                {formatKip(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Footer Thank You */}
          <div className="text-center pt-2 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">** ຂອບໃຈທີ່ອຸດໜູນສິນຄ້າຮ້ານເຮົາ **</p>
            <p className="text-[10px] text-slate-500">ກະລຸນາເກັບໃບບິນນີ້ໄວ້ເປັນຫຼັກຖານ</p>
            <div className="w-full flex justify-center pt-2">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest">
                ||| | ||||| || |||||||| |||| |
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Buttons (no-print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            ປິດ
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow cursor-pointer border border-amber-300"
          >
            <Printer className="w-4 h-4" />
            <span>ພິມໃບບິນ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
