import React, { useState } from 'react';
import { 
  Package, ShoppingCart, ListOrdered, Plus, Edit2, Trash2, 
  Search, Eye, Printer, MapPin, ExternalLink, Check, AlertCircle, 
  Upload, Image as ImageIcon, CheckCircle2, DollarSign, Calculator,
  Store, RefreshCw, X, ArrowLeft
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { formatKip, formatDateLao, getStatusLabel } from '../utils/formatters';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onPrintReceipt: (order: Order) => void;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onPrintReceipt,
  onExitAdmin
}) => {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'pos'>('orders');

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState('');

  // Slip Image Lightbox
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  // Map view modal
  const [selectedOrderLocation, setSelectedOrderLocation] = useState<{
    customer: string;
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Product
  const [pName, setPName] = useState('');
  const [pNameEn, setPNameEn] = useState('');
  const [pCategory, setPCategory] = useState('ເຄື່ອງດື່ມ (Beverages)');
  const [pPrice, setPPrice] = useState<number>(20000);
  const [pStock, setPStock] = useState<number>(20);
  const [pUnit, setPUnit] = useState('ອັນ');
  const [pBarcode, setPBarcode] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');

  // POS Cashier Mode State
  const [posCart, setPosCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [posCustomerName, setPosCustomerName] = useState('ລູກຄ້າໜ້າຮ້ານ');

  // Open Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPNameEn(p.nameEn || '');
    setPCategory(p.category);
    setPPrice(p.price);
    setPStock(p.stock);
    setPUnit(p.unit);
    setPBarcode(p.barcode || '');
    setPDescription(p.description || '');
    setPImage(p.image);
    setIsProductModalOpen(true);
  };

  // Open New Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPNameEn('');
    setPCategory('ເຄື່ອງດື່ມ (Beverages)');
    setPPrice(25000);
    setPStock(20);
    setPUnit('ອັນ');
    setPBarcode(Math.floor(8850029000000 + Math.random() * 999999).toString());
    setPDescription('');
    setPImage('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80');
    setIsProductModalOpen(true);
  };

  // Upload product image from computer
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: pName.trim(),
        nameEn: pNameEn.trim(),
        category: pCategory,
        price: Number(pPrice),
        stock: Number(pStock),
        unit: pUnit.trim() || 'ອັນ',
        barcode: pBarcode.trim(),
        description: pDescription.trim(),
        image: pImage || editingProduct.image
      });
    } else {
      onAddProduct({
        name: pName.trim(),
        nameEn: pNameEn.trim(),
        category: pCategory,
        price: Number(pPrice),
        stock: Number(pStock),
        unit: pUnit.trim() || 'ອັນ',
        barcode: pBarcode.trim(),
        description: pDescription.trim(),
        image: pImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
      });
    }

    setIsProductModalOpen(false);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.barcode && p.barcode.includes(productSearch)) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  // POS Helper functions
  const posSubtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const posChange = Math.max(0, cashReceived - posSubtotal);

  const handlePosAddToCart = (product: Product) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handlePosCheckout = () => {
    if (posCart.length === 0) return;
    const newPosOrder: Order = {
      id: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: posCustomerName || 'ລູກຄ້າໜ້າຮ້ານ',
      phone: 'Walk-in (ໜ້າຮ້ານ)',
      address: 'ຊຳລະ ແລະ ຮັບເຄື່ອງໜ້າຮ້ານ',
      location: null,
      items: posCart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      totalAmount: posSubtotal,
      paymentMethod: 'COD',
      status: 'COMPLETED'
    };
    onPrintReceipt(newPosOrder);
    setPosCart([]);
    setCashReceived(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Lightbox for Slip Image preview */}
      {previewSlipUrl && (
        <div 
          className="fixed inset-0 z-70 bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewSlipUrl(null)}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white font-bold text-sm">ຫຼັກຖານການໂອນເງິນ (Payment Slip)</span>
            <button
              onClick={() => setPreviewSlipUrl(null)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
            >
              ປິດຮູບ
            </button>
          </div>
          <img
            src={previewSlipUrl}
            alt="Payment Slip Full Preview"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border-2 border-emerald-500/50"
          />
        </div>
      )}

      {/* Map Pin Modal */}
      {selectedOrderLocation && (
        <div 
          className="fixed inset-0 z-70 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setSelectedOrderLocation(null)}
        >
          <div 
            className="bg-[#05261d] border-2 border-emerald-500/60 rounded-3xl p-5 max-w-lg w-full text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>ແຜນທີ່ຈັດສົ່ງ: {selectedOrderLocation.customer}</span>
              </h3>
              <button
                onClick={() => setSelectedOrderLocation(null)}
                className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-4 p-3 bg-black/40 rounded-xl space-y-1 text-xs">
              <p className="text-emerald-300 font-semibold">
                ພິກັດ GPS: {selectedOrderLocation.lat}, {selectedOrderLocation.lng}
              </p>
              <p className="text-slate-300">{selectedOrderLocation.address}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps?q=${selectedOrderLocation.lat},${selectedOrderLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ເປີດນຳທາງ Google Maps</span>
              </a>
              <button
                onClick={() => setSelectedOrderLocation(null)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                ປິດ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Top Dashboard Bar (Space Sky Blue Bar) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 rounded-3xl p-5 text-slate-950 shadow-2xl border-2 border-cyan-300/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-cyan-300 flex items-center justify-center shadow-lg border border-cyan-300/40">
              <Store className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                  ADMIN DASHBOARD
                </h1>
                <span className="px-2 py-0.5 bg-slate-950 text-white text-[11px] font-bold rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                ລະບົບຈັດການລາຍການສັ່ງຊື້, ສະຕັອກສິນຄ້າ, ແລະ ຈຸດຂາຍ POS Space Blue
              </p>
            </div>
          </div>

          {/* Red, Blue, Yellow Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Blue Button: Add New Product */}
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 border border-blue-400/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ເພີ່ມສິນຄ້າໃໝ່</span>
            </button>

            {/* Red Button: Exit Admin / Back to Store */}
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 border border-rose-400/50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ກັບໄປໜ້າຮ້ານ</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Sub-Tabs) */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-950/20 overflow-x-auto">
          {/* Orders Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-950 text-cyan-300 shadow-md scale-105'
                : 'bg-black/15 text-slate-950 hover:bg-black/25'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>ຈັດການອໍເດີ້ ({orders.length})</span>
          </button>

          {/* Products Tab */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-slate-950 text-cyan-300 shadow-md scale-105'
                : 'bg-black/15 text-slate-950 hover:bg-black/25'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>ຈັດການສິນຄ້າ & ສະຕັອກ ({products.length})</span>
          </button>

          {/* POS Cashier Tab */}
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pos'
                ? 'bg-slate-950 text-cyan-300 shadow-md scale-105'
                : 'bg-black/15 text-slate-950 hover:bg-black/25'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>ໜ້າຂາຍໜ້າຮ້ານ (POS Mode)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-[#071633] p-4 rounded-2xl border border-blue-800/60 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="ຄົ້ນຫາອໍເດີ້: ເລກອໍເດີ້, ຊື່ລູກຄ້າ, ເບີໂທລະສັບ..."
                className="w-full bg-[#041126] border border-blue-700/60 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['ALL', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-blue-600 text-white shadow border border-cyan-400'
                      : 'bg-[#041126] text-slate-300 hover:bg-blue-900 border border-blue-700/40'
                  }`}
                >
                  {st === 'ALL'
                    ? 'ທັງໝົດ'
                    : st === 'PREPARING'
                    ? 'ກຳລັງກຽມເຄື່ອງ'
                    : st === 'DELIVERING'
                    ? 'ກຳລັງຈັດສົ່ງ'
                    : st === 'COMPLETED'
                    ? 'ຈັດສົ່ງສຳເລັດ'
                    : 'ຍົກເລີກ'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table / Cards */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-[#071633] border border-blue-800/60 rounded-2xl text-slate-400">
                ບໍ່ພົບລາຍການສັ່ງຊື້ທີ່ກົງກັບເງື່ອນໄຂ
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-[#05142e] border border-blue-800/50 hover:border-cyan-400/60 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-900/60">
                      <div className="flex items-center gap-3">
                        <span className="text-base sm:text-lg font-black text-amber-400 font-english">
                          #{order.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDateLao(order.createdAt)}
                        </span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">ປ່ຽນສະຖານະ:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${statusInfo.bg} ${statusInfo.textCol} ${statusInfo.border}`}
                        >
                          <option value="PREPARING" className="bg-[#071633] text-amber-400">
                            ກຳລັງກຽມເຄື່ອງ
                          </option>
                          <option value="DELIVERING" className="bg-[#071633] text-blue-400">
                            ກຳລັງຈັດສົ່ງ
                          </option>
                          <option value="COMPLETED" className="bg-[#071633] text-emerald-400">
                            ຈັດສົ່ງສຳເລັດແລ້ວ
                          </option>
                          <option value="CANCELLED" className="bg-[#071633] text-rose-400">
                            ຍົກເລີກແລ້ວ
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Order Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* Column 1: Customer Details */}
                      <div className="space-y-1.5 bg-[#041126] p-3 rounded-xl border border-blue-900/60">
                        <h4 className="font-bold text-white uppercase text-[11px] text-cyan-400">
                          ຂໍ້ມູນລູກຄ້າ
                        </h4>
                        <div>
                          <span className="text-slate-400">ຊື່: </span>
                          <strong className="text-white">{order.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">ເບີໂທ: </span>
                          <strong className="text-cyan-300 font-english">{order.phone}</strong>
                        </div>
                        <div className="line-clamp-2">
                          <span className="text-slate-400">ທີ່ຢູ່: </span>
                          <span className="text-slate-200">{order.address}</span>
                        </div>
                        {order.notes && (
                          <div className="text-cyan-300/90 text-[11px] italic">
                            ໝາຍເຫດ: "{order.notes}"
                          </div>
                        )}
                      </div>

                      {/* Column 2: Ordered Items */}
                      <div className="space-y-1.5 bg-[#041126] p-3 rounded-xl border border-blue-900/60 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white uppercase text-[11px] text-cyan-400 mb-1">
                            ລາຍການສິນຄ້າ ({order.items.length} ຢ່າງ)
                          </h4>
                          <div className="max-h-24 overflow-y-auto space-y-1 pr-1 divide-y divide-blue-950">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="pt-1 flex justify-between items-center text-[11px]">
                                <span className="truncate pr-2 text-slate-300">
                                  {it.productName} x {it.quantity}
                                </span>
                                <span className="font-english font-bold text-white">
                                  {formatKip(it.price * it.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-blue-950 flex justify-between items-baseline">
                          <span className="text-slate-400 font-bold">ຍອດລວມ:</span>
                          <span className="text-base font-black text-amber-400 font-english">
                            {formatKip(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Column 3: Payment Proof Slip & Map Location */}
                      <div className="space-y-2 bg-[#041126] p-3 rounded-xl border border-blue-900/60">
                        <h4 className="font-bold text-white uppercase text-[11px] text-cyan-400">
                          ການຊຳລະ & ແຜນທີ່ຈັດສົ່ງ
                        </h4>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">ວິທີຈ່າຍ:</span>
                          <span className="font-bold text-white">
                            {order.paymentMethod === 'COD' ? 'ຈ່າຍເງິນສົດປາຍທາງ (COD)' : 'Bank QR Code'}
                          </span>
                        </div>

                        {/* Slip preview if QR Code */}
                        {order.paymentMethod === 'QR' && (
                          <div className="flex items-center gap-2 pt-1">
                            {order.paymentSlipUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewSlipUrl(order.paymentSlipUrl || null)}
                                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-300 text-xs font-bold cursor-pointer"
                              >
                                <img
                                  src={order.paymentSlipUrl}
                                  alt="Slip"
                                  className="w-5 h-5 rounded object-cover"
                                />
                                <Eye className="w-3.5 h-3.5" />
                                <span>ເບິ່ງສະລິບໂອນເງິນ</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-rose-400">
                                ຍັງບໍ່ມີຮູບສະລິບ
                              </span>
                            )}
                          </div>
                        )}

                        {/* Location button */}
                        {order.location ? (
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderLocation({
                                customer: order.customerName,
                                lat: order.location!.lat,
                                lng: order.location!.lng,
                                address: order.address
                              })}
                              className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-cyan-200 border border-blue-600/50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                              <span>ເບິ່ງປັກໝຸດ GPS ({order.location.lat.toFixed(3)}, {order.location.lng.toFixed(3)})</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            ບໍ່ມີພິກັດ GPS (ຈັດສົ່ງຕາມທີ່ຢູ່)
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Bottom Action row */}
                    <div className="pt-2 flex justify-end gap-2">
                      {/* Blue Button: Print POS Receipt */}
                      <button
                        onClick={() => onPrintReceipt(order)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer border border-blue-400/40"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>ພິມໃບບິນ POS</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Header & Search */}
          <div className="bg-[#071633] p-4 rounded-2xl border border-blue-800/60 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-lg">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="ຄົ້ນຫາສິນຄ້າ: ຊື່ສິນຄ້າ, ບາໂຄດ, ໝວດໝູ່..."
                className="w-full bg-[#041126] border border-blue-700/60 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Blue Button: Add Product */}
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer border border-blue-400/40"
            >
              <Plus className="w-4 h-4" />
              <span>ເພີ່ມສິນຄ້າໃໝ່ (Add Product)</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#05142e] border border-blue-800/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-cyan-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-cyan-400/30">
                    ສະຕັອກ: {p.stock} {p.unit}
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{p.category}</span>
                    <h4 className="font-bold text-white text-sm line-clamp-1 mt-0.5">
                      {p.name}
                    </h4>
                    <div className="text-amber-400 font-black font-english text-base mt-1">
                      {formatKip(p.price)}
                    </div>
                  </div>

                  {/* Actions: Blue for Edit, Red for Delete */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-900/60">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>ແກ້ໄຂ</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`ທ່ານຕ້ອງການລົບສິນຄ້າ "${p.name}" ແທ້ບໍ່?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ລົບ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IN-STORE POS MODE */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Product Catalog for POS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#071633] p-4 rounded-2xl border border-blue-800/60 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ສະແກນ Barcode ຫຼື ພິມຊື່ສິນຄ້າເພື່ອຂາຍ..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePosAddToCart(p)}
                  className="p-3 bg-[#05142e] hover:bg-[#071f45] border border-blue-800/50 hover:border-cyan-400 rounded-2xl text-left transition-all active:scale-95 flex flex-col justify-between cursor-pointer"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <div className="font-bold text-white text-xs line-clamp-1">{p.name}</div>
                  <div className="text-amber-400 font-black font-english text-sm mt-1">
                    {formatKip(p.price)}
                  </div>
                  <div className="text-[10px] text-slate-400">ເຫຼືອ {p.stock} {p.unit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Col: POS Cashier Cart & Calculator */}
          <div className="bg-[#071633] p-5 rounded-3xl border-2 border-blue-600/50 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-900">
                <h3 className="font-black text-lg text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <span>ລາຍການຂາຍໜ້າຮ້ານ</span>
                </h3>
                {posCart.length > 0 && (
                  <button
                    onClick={() => setPosCart([])}
                    className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    ລ້າງທັງໝົດ
                  </button>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ຊື່ລູກຄ້າໜ້າຮ້ານ (Walk-in)
                </label>
                <input
                  type="text"
                  value={posCustomerName}
                  onChange={(e) => setPosCustomerName(e.target.value)}
                  className="w-full bg-[#041126] border border-blue-700/50 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              {/* Items in POS cart */}
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-blue-950/60">
                {posCart.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    ກົດເລືອກສິນຄ້າດ້ານຊ້າຍເພື່ອເພີ່ມລົງລາຍການ
                  </div>
                ) : (
                  posCart.map((item) => (
                    <div key={item.product.id} className="pt-2 flex justify-between items-center text-xs">
                      <div className="flex-1 truncate pr-2">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <div className="text-slate-400 font-english">
                          {formatKip(item.product.price)} x {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-amber-400 font-english">
                          {formatKip(item.product.price * item.quantity)}
                        </div>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                setPosCart(posCart.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity - 1 } : i));
                              } else {
                                setPosCart(posCart.filter(i => i.product.id !== item.product.id));
                              }
                            }}
                            className="w-5 h-5 bg-rose-900/60 text-white rounded text-[10px]"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs text-white">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setPosCart(posCart.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i));
                            }}
                            className="w-5 h-5 bg-blue-900 text-white rounded text-[10px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total, Cash Tendered & Change */}
            <div className="mt-6 pt-4 border-t border-blue-900/80 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-300">ຍອດເງິນທີ່ຕ້ອງຈ່າຍ:</span>
                <span className="text-2xl font-black text-amber-400 font-english">
                  {formatKip(posSubtotal)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ຮັບເງິນສົດຈາກລູກຄ້າ (Cash Received):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={cashReceived || ''}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-[#041126] border border-blue-600/60 rounded-xl px-3 py-2 text-white font-english text-lg font-bold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">ກີບ</span>
                </div>
              </div>

              {cashReceived > 0 && (
                <div className="p-3 bg-blue-950/80 rounded-xl border border-blue-600/60 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-cyan-300">ເງິນທອນ (Change):</span>
                  <span className="text-xl font-black text-cyan-400 font-english">
                    {formatKip(posChange)}
                  </span>
                </div>
              )}

              {/* Yellow Button: Complete Sale and Print Receipt */}
              <button
                disabled={posCart.length === 0}
                onClick={handlePosCheckout}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 border-2 border-amber-300 cursor-pointer transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>ຊຳລະເງິນ & ພິມໃບບິນ POS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-70 bg-black/85 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div 
            className="bg-[#071633] border-2 border-blue-500/60 rounded-3xl p-5 sm:p-6 max-w-xl w-full text-white shadow-2xl my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-blue-900">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? 'ແກ້ໄຂຂໍ້ມູນສິນຄ້າ' : 'ເພີ່ມສິນຄ້າໃໝ່'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ຊື່ສິນຄ້າ (ພາສາລາວ) *
                </label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="ຕົວຢ່າງ: ກາເຟດາວ ເອັສເພຣສໂຊ"
                  className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    ຊື່ພາສາອັງກິດ (English Name)
                  </label>
                  <input
                    type="text"
                    value={pNameEn}
                    onChange={(e) => setPNameEn(e.target.value)}
                    placeholder="Dao Coffee Espresso"
                    className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    ໝວດໝູ່ສິນຄ້າ
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="ເຄື່ອງດື່ມ (Beverages)">ເຄື່ອງດື່ມ (Beverages)</option>
                    <option value="ອາຫານ & ຂອງກິນ (Food & Groceries)">ອາຫານ & ຂອງກິນ</option>
                    <option value="ເຄື່ອງໃຊ້ໃນເຮືອນ (Home & Living)">ເຄື່ອງໃຊ້ໃນເຮືອນ</option>
                    <option value="ເຄື່ອງໄຟຟ້າ & Gadget">ເຄື່ອງໄຟຟ້າ & Gadget</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    ລາຄາຂາຍ (₭) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    ຈຳນວນໃນສະຕັອກ *
                  </label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    ຫົວໜ່ວຍ (Unit)
                  </label>
                  <input
                    type="text"
                    value={pUnit}
                    onChange={(e) => setPUnit(e.target.value)}
                    placeholder="ຂວດ, ຊອງ, ອັນ..."
                    className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Image Upload Directly from Computer */}
              <div className="space-y-2 p-3 bg-[#041126] rounded-2xl border border-blue-700/50">
                <label className="block text-xs font-bold text-cyan-300">
                  ຮູບພາບສິນຄ້າ (ອັບໂຫຼດໂດຍກົງຈາກຄອມພິວເຕີ ຫຼື ໃສ່ Link)
                </label>

                <div className="flex items-center gap-3">
                  {pImage && (
                    <img
                      src={pImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-blue-600/50"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>ເລືອກຮູບຈາກຄອມພິວເຕີ</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={pImage}
                      onChange={(e) => setPImage(e.target.value)}
                      placeholder="ຫຼື ວາງ URL ຮູບພາບ (https://...)"
                      className="w-full bg-[#05142e] border border-blue-700/40 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-300 mb-1">
                  ລາຍລະອຽດສິນຄ້າ
                </label>
                <textarea
                  rows={2}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="ຄຳອະທິບາຍສິນຄ້າ..."
                  className="w-full bg-[#041126] border border-blue-700/60 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Action Buttons: Red and Yellow */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  ຍົກເລີກ
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-lg cursor-pointer border border-amber-300"
                >
                  ບັນທຶກສິນຄ້າ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
