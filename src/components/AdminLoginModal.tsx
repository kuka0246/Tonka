import React, { useState } from 'react';
import { X, Lock, ShieldCheck, User, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! (ທົດລອງ: admin / admin)');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#071633] border-2 border-blue-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Space Sky Blue Bar) */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-5 flex items-center justify-between text-slate-950 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-cyan-300 flex items-center justify-center shadow">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950 leading-tight">
                ເຂົ້າສູ່ລະບົບ Admin
              </h3>
              <p className="text-xs font-bold text-slate-900">
                ລະບົບຈັດການຫຼັງບ້ານ POS Lao Space Blue
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

        {/* Login Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Info Box */}
          <div className="p-3 bg-[#041126] border border-blue-700/50 rounded-2xl text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block">ລະຫັດຜ່ານເລີ່ມຕົ້ນຂອງລະບົບ:</span>
              <span className="font-mono text-cyan-300 font-bold">admin / admin</span>
            </div>
            {/* Blue Button: Quick Autofill */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] shadow transition-colors cursor-pointer"
            >
              ຕື່ມອັດຕະໂນມັດ
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/90 border border-rose-600/70 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Username (ຊື່ຜູ້ໃຊ້ງານ)</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-[#05142e] border border-blue-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-english"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Password (ລະຫັດຜ່ານ)</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#05142e] border border-blue-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-english"
            />
          </div>

          {/* Action Buttons: Red and Yellow */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {/* Red Button: Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all active:scale-95 border border-rose-400/40 cursor-pointer"
            >
              ຍົກເລີກ
            </button>

            {/* Yellow Button: Login */}
            <button
              type="submit"
              className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>ເຂົ້າສູ່ລະບົບ</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
