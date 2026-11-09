import React, { useState } from 'react';
import { Search, Clock, PackageCheck, Truck, CheckCircle2, MapPin, Printer, ArrowLeft } from 'lucide-react';
import { Order } from '../types';
import { formatKip, formatDateLao, getStatusLabel } from '../utils/formatters';

interface OrderTrackerProps {
  orders: Order[];
  onBackToStore: () => void;
  onPrintReceipt: (order: Order) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  onBackToStore,
  onPrintReceipt
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(term) ||
      o.phone.includes(term) ||
      o.customerName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner (Space Sky Blue Bar) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 rounded-3xl p-6 text-slate-950 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 leading-tight">
            ກວດສອບ ແລະ ຕິດຕາມສະຖານະອໍເດີ້
          </h2>
          <p className="text-xs font-bold text-slate-900 mt-0.5">
            Real-time Space Blue Order Tracking & Delivery Status
          </p>
        </div>

        {/* Blue Button: Back to Store */}
        <button
          onClick={onBackToStore}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer border border-blue-400/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບໄປໜ້າຫຼັກສິນຄ້າ</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-[#071633] p-4 rounded-2xl border border-blue-800/60 flex items-center gap-3 shadow-lg">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ພິມເບີໂທລະສັບ ຫຼື ລະຫັດອໍເດີ້ (LAO-2026-...) ເພື່ອກວດສອບ..."
          className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white"
          >
            ລ້າງ
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#071633] border border-blue-800/60 rounded-3xl text-slate-400 space-y-3">
            <Clock className="w-10 h-10 text-cyan-400 mx-auto" />
            <h4 className="text-base font-bold text-white">ບໍ່ພົບຂໍ້ມູນອໍເດີ້</h4>
            <p className="text-xs text-slate-400">
              ກະລຸນາກວດສອບເບີໂທ ຫຼື ລະຫັດອໍເດີ້ຄືນໃໝ່
            </p>
          </div>
        ) : (
          filtered.map((order) => {
            const statusInfo = getStatusLabel(order.status);
            const isStep1 = true;
            const isStep2 = order.status === 'DELIVERING' || order.status === 'COMPLETED';
            const isStep3 = order.status === 'COMPLETED';

            return (
              <div
                key={order.id}
                className="bg-[#05142e] border border-blue-800/60 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5"
              >
                {/* Order Top Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-blue-900/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-amber-400 font-english">
                        #{order.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({formatDateLao(order.createdAt)})
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      ຜູ້ສັ່ງຊື້: <strong>{order.customerName}</strong> &bull; ໂທ: {order.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.textCol} ${statusInfo.border}`}>
                      {statusInfo.text}
                    </span>

                    {/* Blue Button: Print Receipt */}
                    <button
                      onClick={() => onPrintReceipt(order)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow cursor-pointer border border-blue-400/40"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>ໃບບິນ</span>
                    </button>
                  </div>
                </div>

                {/* Status Progress Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-3 relative">
                    {/* Progress Bar background line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-950 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: isStep3 ? '100%' : isStep2 ? '50%' : '15%'
                      }}
                    />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                        isStep1 ? 'bg-blue-600 text-white border-2 border-cyan-300' : 'bg-blue-950 text-slate-400'
                      }`}>
                        <PackageCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1.5">
                        ກຳລັງກຽມເຄື່ອງ
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                        isStep2 ? 'bg-indigo-600 text-white border-2 border-cyan-300' : 'bg-blue-950 text-slate-400'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1.5">
                        ກຳລັງຈັດສົ່ງ
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                        isStep3 ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-300' : 'bg-blue-950 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-1.5">
                        ຈັດສົ່ງສຳເລັດແລ້ວ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items & Location info */}
                <div className="p-3 bg-[#041126] rounded-2xl border border-blue-900/60 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-semibold">ລາຍການສິນຄ້າ:</span>
                    <p className="text-white">
                      {order.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      ທີ່ຢູ່: {order.address}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-slate-400 block">ຍອດລວມ:</span>
                    <span className="text-lg font-black text-amber-400 font-english">
                      {formatKip(order.totalAmount)}
                    </span>
                    <div className="text-[11px] text-cyan-300 mt-0.5">
                      {order.paymentMethod === 'COD' ? 'ຈ່າຍເງິນສົດປາຍທາງ (COD)' : 'Bank QR Code'}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
