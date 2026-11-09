import { OrderStatus } from '../types';

export function formatKip(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₭';
  return new Intl.NumberFormat('lo-LA').format(Math.round(amount)) + ' ₭';
}

export function getStatusLabel(status: OrderStatus): { text: string; bg: string; textCol: string; border: string } {
  switch (status) {
    case 'PREPARING':
      return {
        text: 'ກຳລັງກຽມເຄື່ອງ',
        bg: 'bg-amber-500/20',
        textCol: 'text-amber-400',
        border: 'border-amber-500/40'
      };
    case 'DELIVERING':
      return {
        text: 'ກຳລັງຈັດສົ່ງ',
        bg: 'bg-blue-500/20',
        textCol: 'text-blue-400',
        border: 'border-blue-500/40'
      };
    case 'COMPLETED':
      return {
        text: 'ຈັດສົ່ງສຳເລັດແລ້ວ',
        bg: 'bg-emerald-500/20',
        textCol: 'text-emerald-400',
        border: 'border-emerald-500/40'
      };
    case 'CANCELLED':
      return {
        text: 'ຍົກເລີກແລ້ວ',
        bg: 'bg-rose-500/20',
        textCol: 'text-rose-400',
        border: 'border-rose-500/40'
      };
    default:
      return {
        text: status,
        bg: 'bg-slate-700',
        textCol: 'text-slate-200',
        border: 'border-slate-600'
      };
  }
}

export function formatDateLao(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('lo-LA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
