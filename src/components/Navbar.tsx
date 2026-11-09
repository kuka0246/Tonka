import React from 'react';
import { ShoppingBag, ShieldCheck, MapPin, Sparkles, Store, Clock } from 'lucide-react';
import { formatKip } from '../utils/formatters';

interface NavbarProps {
  currentView: 'store' | 'admin' | 'tracking';
  onNavigate: (view: 'store' | 'admin' | 'tracking') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  hasLocation: boolean;
  onOpenLocationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  hasLocation,
  onOpenLocationModal
}) => {
  return (
    <header className="sticky top-0 z-50">
      {/* Top Space Accent Bar */}
      <div className="bg-[#020a1c] border-b border-blue-900/60 text-xs px-4 py-1.5 flex items-center justify-between text-blue-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-english text-[13px] tracking-wide text-cyan-200">
            POS LAO ONLINE &bull; ລະບົບຂາຍສິນຄ້າ ແລະ ຈັດສົ່ງອັດສະລິຍະ
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> ເວັບໄຊທ໌ເປີດບໍລິການ 24/7
          </span>
          <span className="text-cyan-300 font-medium">ຮອງຮັບ COD & BCEL QR</span>
        </div>
      </div>

      {/* Main Space Blue Bar (ແຖບສີຟ້າ Space Sky Blue) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 text-slate-900 shadow-2xl px-4 py-2.5 sm:px-6 border-b-2 border-cyan-300/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onNavigate('store')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-cyan-400/40">
              <Store className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm font-english">
                  POS LAO
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-950 text-cyan-300 rounded-md tracking-wider">
                  SPACE BLUE
                </span>
              </div>
              <p className="text-xs font-bold text-slate-950/90 leading-tight">
                ລະບົບຂາຍໜ້າຮ້ານ & ສັ່ງຊື້ອອນໄລ
              </p>
            </div>
          </div>

          {/* Main Menu (ເມນູຫຼັກມີຕົວອັກສອນເປັນ Font Phetsarath OT ມີ size =18 font type = Bold ຕົວອັກສອນສີດຳ) */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('store')}
              className={`main-menu-font px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'store'
                  ? 'bg-black/15 shadow-inner underline decoration-2 underline-offset-4'
                  : 'hover:bg-black/10'
              }`}
            >
              ໜ້າຫຼັກ (Home)
            </button>

            <button
              onClick={() => onNavigate('store')}
              className="main-menu-font px-3 py-1.5 rounded-lg transition-all hover:bg-black/10 cursor-pointer"
            >
              ລາຍການສິນຄ້າ (Catalog)
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className={`main-menu-font px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'tracking'
                  ? 'bg-black/15 shadow-inner underline decoration-2 underline-offset-4'
                  : 'hover:bg-black/10'
              }`}
            >
              <Clock className="w-4 h-4 text-black" />
              <span>ຕິດຕາມອໍເດີ້ (Track)</span>
            </button>

            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  onNavigate('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`main-menu-font px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-black/20 text-black shadow-inner underline decoration-2 underline-offset-4'
                  : 'hover:bg-black/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Admin Panel (ລະບົບຫຼັງບ້ານ)</span>
            </button>
          </nav>

          {/* Action Buttons: Red, Blue, and Yellow as required */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Blue Button (ປຸ່ມສີຟ້າ): Location / GPS status */}
            <button
              onClick={onOpenLocationModal}
              title="ກວດສອບສະຖານທີ່ຈັດສົ່ງ"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md flex items-center gap-1.5 text-xs sm:text-sm font-bold border border-blue-400/40 active:scale-95 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-cyan-200" />
              <span className="hidden sm:inline">
                {hasLocation ? 'ຕຳແໜ່ງ GPS ພ້ອມ' : 'ປັກໝຸດ GPS'}
              </span>
            </button>

            {/* Yellow Button (ປຸ່ມສີເຫຼືອງ): Shopping Cart System */}
            <button
              onClick={onOpenCart}
              className="relative px-3 sm:px-4 py-2 bg-amber-300 hover:bg-amber-200 text-slate-950 rounded-xl shadow-lg flex items-center gap-2 font-bold text-xs sm:text-sm border-2 border-amber-400 active:scale-95 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-700 leading-none">ກະຕ່າ</div>
                <div className="text-xs font-black text-slate-950 font-english leading-tight">
                  {cartTotal > 0 ? formatKip(cartTotal) : '0 ₭'}
                </div>
              </div>
            </button>

            {/* Red Button (ປຸ່ມສີແດງ): Admin Login / Switch or Logout */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-2.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hidden md:flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="ອອກຈາກລະບົບ Admin"
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md text-xs font-bold border border-rose-400/50 active:scale-95 transition-all cursor-pointer"
                >
                  <span>ອອກລະບົບ</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md flex items-center gap-1 text-xs font-bold border border-rose-400/50 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Row (Phetsarath OT, bold, black) */}
        <div className="md:hidden mt-2 pt-2 border-t border-black/15 flex items-center justify-around">
          <button
            onClick={() => onNavigate('store')}
            className={`main-menu-font text-xs py-1 px-2 rounded ${
              currentView === 'store' ? 'bg-black/15 font-black' : ''
            }`}
          >
            ໜ້າຫຼັກ (Home)
          </button>
          <button
            onClick={() => onNavigate('tracking')}
            className={`main-menu-font text-xs py-1 px-2 rounded ${
              currentView === 'tracking' ? 'bg-black/15 font-black' : ''
            }`}
          >
            ຕິດຕາມອໍເດີ້
          </button>
          <button
            onClick={() => {
              if (isAdminLoggedIn) onNavigate('admin');
              else onOpenAdminLogin();
            }}
            className={`main-menu-font text-xs py-1 px-2 rounded ${
              currentView === 'admin' ? 'bg-black/15 font-black' : ''
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
};
