import React, { useState } from 'react';
import { X, Upload, CheckCircle2, QrCode, Banknote, ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';
import { CartItem, DeliveryLocation, Order } from '../types';
import { formatKip } from '../utils/formatters';
import { MapPicker } from './MapPicker';
import { STORE_BANK_INFO } from '../data/initialProducts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  defaultLocation: DeliveryLocation | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  defaultLocation,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<DeliveryLocation | null>(defaultLocation || {
    lat: 17.9705,
    lng: 102.6331,
    addressText: 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane)'
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QR'>('COD');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // File upload for Bank Transfer Slip
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('ຮູບພາບສະລິບມີຂະໜາດໃຫຍ່ເກີນໄປ (ສູງສຸດ 8MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSlip = () => {
    setSlipImage(null);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!customerName.trim()) {
      setErrorMessage('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນຂອງລູກຄ້າ');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setErrorMessage('ກະລຸນາປ້ອນເບີໂທລະສັບທີ່ຖືກຕ້ອງ (ຕົວຢ່າງ: 020 55667788)');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('ກະລຸນາປ້ອນທີ່ຢູ່ ຫຼື ຈຸດສັງເກດສຳລັບການຈັດສົ່ງ');
      return;
    }
    if (paymentMethod === 'QR' && !slipImage) {
      setErrorMessage('ທ່ານເລືອກຈ່າຍດ້ວຍ QR Code, ກະລຸນາອັບໂຫຼດຮູບສະລິບ (Slip) ຫຼັກຖານການໂອນເງິນ');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `LAO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      location: location,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      totalAmount,
      paymentMethod,
      paymentSlipUrl: paymentMethod === 'QR' ? slipImage || undefined : undefined,
      status: 'PREPARING'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#071633] border-2 border-blue-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4 max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Space Sky Blue Bar) */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 px-6 py-4 flex items-center justify-between text-slate-950 shadow-lg shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
              ຢືນຢັນການສັ່ງຊື້ & ຂໍ້ມູນການຈັດສົ່ງ
            </h2>
            <p className="text-xs font-bold text-slate-900">
              POS Lao Space Blue Delivery & Payment Gateway
            </p>
          </div>

          {/* Red Button to Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all border border-rose-300/40 cursor-pointer"
            title="ປິດ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form Scrollable */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/90 border border-rose-600 rounded-xl text-rose-200 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Information */}
          <div className="bg-[#041126] p-4 sm:p-5 rounded-2xl border border-blue-800/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-blue-900/60">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-white text-base">
                ຂໍ້ມູນຜູ້ຮັບສິນຄ້າ (Customer Information)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ຊື່ ແລະ ນາມສະກຸນລູກຄ້າ *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ສົມພອນ ໄຊຍະວົງ"
                  className="w-full bg-[#05142e] border border-blue-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ເບີໂທລະສັບ (Phone Number) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ຕົວຢ່າງ: 020 5566 7788"
                  className="w-full bg-[#05142e] border border-blue-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-english"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ທີ່ຢູ່ຈັດສົ່ງ / ຊື່ບ້ານ / ຈຸດສັງເກດ *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ບ້ານ ໂພນໄຊ, ຮ່ອມ 5, ເມືອງ ໄຊເສດຖາ (ໃກ້ປ້ຳນ້ຳມັນ ປຕທ)"
                  className="w-full bg-[#05142e] border border-blue-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ໝາຍເຫດເພີ່ມເຕີມເຖິງຄົນສົ່ງເຄື່ອງ (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ໂທຫາກ່ອນມາຮອດ 10 ນາທີ, ຝາກໄວ້ປ້ອມຍາມ, ເອົາເງິນທອນ 100,000 ກີບ..."
                  className="w-full bg-[#05142e] border border-blue-800/60 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location Tracking with GPS and Interactive Map */}
          <div className="bg-[#041126] p-4 sm:p-5 rounded-2xl border border-blue-800/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Location Tracking (ປັກໝຸດ GPS ສົ່ງເຄື່ອງ)
                  </h3>
                  <p className="text-xs text-slate-400">
                    ກົດປຸ່ມ "Get My Location" ຫຼື ຄົ້ນຫາ / ຄລິກເລືອກຈຸດປັກໝຸດເທິງແຜນທີ່
                  </p>
                </div>
              </div>
            </div>

            <MapPicker
              location={location}
              onChangeLocation={(loc) => setLocation(loc)}
              customerAddress={address}
            />
          </div>

          {/* Section 3: Payment Gateway (2 options: COD or Bank QR Code) */}
          <div className="bg-[#041126] p-4 sm:p-5 rounded-2xl border border-blue-800/60 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-blue-900/60">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-white text-base">
                ຊ່ອງທາງການຊຳລະເງິນ (Payment Method)
              </h3>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-blue-950/90 border-amber-400 shadow-lg'
                    : 'bg-[#05142e] border-blue-900/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${paymentMethod === 'COD' ? 'bg-amber-400 text-slate-950' : 'bg-blue-900 text-cyan-300'}`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">
                      1. Cash on Delivery (COD)
                    </h4>
                    {paymentMethod === 'COD' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    ຈ່າຍເງິນສົດປາຍທາງເມື່ອໄດ້ຮັບສິນຄ້າ ພ້ອມກວດເຊັກເຄື່ອງກ່ອນຈ່າຍ
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] bg-blue-900/80 text-cyan-300 font-semibold">
                    ສະດວກ • ປອດໄພ • ບໍ່ມີຄ່າທຳນຽມ
                  </span>
                </div>
              </div>

              {/* Option 2: Bank QR Code */}
              <div
                onClick={() => setPaymentMethod('QR')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'QR'
                    ? 'bg-blue-950/90 border-cyan-400 shadow-lg'
                    : 'bg-[#05142e] border-blue-900/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${paymentMethod === 'QR' ? 'bg-cyan-400 text-slate-950' : 'bg-blue-900 text-blue-300'}`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">
                      2. Bank QR Code (OnePay / ທະນາຄານ)
                    </h4>
                    {paymentMethod === 'QR' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    ສະແກນ QR ຜ່ານແອັບທະນາຄານ (BCEL One) ແລະ ອັບໂຫຼດສະລິບຫຼັກຖານ
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[11px] bg-blue-900/60 text-cyan-300 font-semibold">
                    BCEL OnePay • ໂອນໄວ • ກວດສອບອັດຕະໂນມັດ
                  </span>
                </div>
              </div>
            </div>

            {/* If Bank QR selected, show QR Code details & Upload Slip box */}
            {paymentMethod === 'QR' && (
              <div className="p-4 bg-[#020b1c] border-2 border-cyan-500/40 rounded-2xl space-y-4 animate-fadeIn">
                <div className="text-center sm:text-left sm:flex items-center justify-between gap-4 pb-3 border-b border-cyan-900/60">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      ສະແກນ QR Code ເພື່ອຊຳລະເງິນ
                    </span>
                    <h4 className="text-lg font-black text-white">
                      ຍອດໂອນ: <span className="text-amber-400 font-english">{formatKip(totalAmount)}</span>
                    </h4>
                  </div>
                  <div className="text-xs text-slate-300 mt-2 sm:mt-0 text-right">
                    <div>{STORE_BANK_INFO.bankName}</div>
                    <div className="font-bold text-white">{STORE_BANK_INFO.accountName}</div>
                    <div className="font-mono text-cyan-200">{STORE_BANK_INFO.accountNumber}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                  {/* QR Code image */}
                  <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center">
                    <img
                      src={STORE_BANK_INFO.qrSampleUrl}
                      alt="BCEL OnePay QR Code"
                      className="w-48 h-48 object-contain"
                    />
                    <div className="text-[11px] font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>OnePay / LAO QR CODE</span>
                    </div>
                  </div>

                  {/* Upload Slip Box */}
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs font-bold text-cyan-300">
                      ອັບໂຫຼດສະລິບ (Slip) ຫຼັກຖານການໂອນເງິນ *
                    </label>

                    {slipImage ? (
                      <div className="relative p-2 bg-[#051532] border border-cyan-500/60 rounded-xl flex items-center gap-3">
                        <img
                          src={slipImage}
                          alt="Slip Preview"
                          className="w-20 h-24 object-cover rounded-lg border border-slate-700 shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> ອັບໂຫຼດຮູບສະລິບແລ້ວ
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            ພ້ອມສົ່ງໃຫ້ພະນັກງານກວດສອບ
                          </p>
                          {/* Red Button: Remove slip */}
                          <button
                            type="button"
                            onClick={handleRemoveSlip}
                            className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            ລົບຮູບສະລິບອອກ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-cyan-600/50 hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[#040f25] hover:bg-[#07193d] transition-all">
                        <Upload className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
                        <span className="text-xs font-bold text-white">
                          ຄລິກເພື່ອອັບໂຫຼດຮູບພາບສະລິບ
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          ຮອງຮັບ JPG, PNG, WEBP ຈາກມືຖື ຫຼື ຄອມພິວເຕີ
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSlipUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary */}
          <div className="bg-[#041126] p-4 rounded-2xl border border-blue-800/60">
            <h4 className="text-xs font-bold uppercase text-cyan-400 mb-2">
              ສະຫຼຸບລາຍການທີ່ສັ່ງຊື້ ({items.length} ລາຍການ)
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 divide-y divide-blue-950/60 text-xs">
              {items.map((item) => (
                <div key={item.product.id} className="pt-1.5 flex justify-between items-center text-slate-300">
                  <span className="truncate pr-2">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-bold text-white font-english shrink-0">
                    {formatKip(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 mt-2 border-t border-blue-900 flex justify-between items-baseline">
              <span className="font-bold text-white text-sm">ຍອດຊຳລະສຸດທິ:</span>
              <span className="text-2xl font-black text-amber-400 font-english">
                {formatKip(totalAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Red, Blue, Yellow */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            {/* Red Button: Cancel / Return */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all active:scale-95 border border-rose-400/40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ຍົກເລີກ / ກັບຄືນ</span>
            </button>

            {/* Yellow Button: Confirm Order */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base rounded-xl shadow-xl transition-all active:scale-95 border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>ກຳລັງບັນທຶກອໍເດີ້...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>ຢືນຢັນການສັ່ງຊື້ ({formatKip(totalAmount)})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
