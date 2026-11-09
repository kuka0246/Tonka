import React from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { DeliveryLocation } from '../types';
import { MapPicker } from './MapPicker';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: DeliveryLocation | null;
  onSaveLocation: (loc: DeliveryLocation) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onSaveLocation
}) => {
  const [currentLoc, setCurrentLoc] = React.useState<DeliveryLocation | null>(location || {
    lat: 17.9705,
    lng: 102.6331,
    addressText: 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane)'
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (currentLoc) {
      onSaveLocation(currentLoc);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#071633] border-2 border-blue-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Space Sky Blue Bar) */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-4 flex items-center justify-between text-slate-950 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-slate-950" />
            <div>
              <h3 className="font-black text-lg text-slate-950 leading-tight">
                ກຳນົດຈຸດປັກໝຸດ GPS ສົ່ງເຄື່ອງ
              </h3>
              <p className="text-xs font-bold text-slate-900">
                HTML5 Geolocation API & Interactive Map
              </p>
            </div>
          </div>

          {/* Red Button: Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow transition-all active:scale-90 border border-rose-300/40 cursor-pointer"
            title="ປິດ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Picker Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300">
            ກົດປຸ່ມ <strong>"Get My Location"</strong> ເພື່ອດຶງ GPS ອັດຕະໂນມັດ ຫຼື ຄລິກເລືອກຈຸດປັກໝຸດເທິງແຜນທີ່:
          </p>

          <MapPicker
            location={currentLoc}
            onChangeLocation={(loc) => setCurrentLoc(loc)}
          />

          {/* Action Buttons: Red and Yellow */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Red Button: Cancel */}
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all active:scale-95 border border-rose-400/40 cursor-pointer"
            >
              ຍົກເລີກ
            </button>

            {/* Yellow Button: Save Location */}
            <button
              onClick={handleConfirm}
              className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>ບັນທຶກຕຳແໜ່ງນີ້</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
