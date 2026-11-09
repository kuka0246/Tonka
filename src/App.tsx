import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ShoppingCart, Sparkles, Truck, 
  ShieldCheck, ArrowRight, QrCode, Banknote, RefreshCw, 
  Flame, CheckCircle, Package, HelpCircle, PhoneCall
} from 'lucide-react';
import { Product, CartItem, Order, OrderStatus, DeliveryLocation } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialProducts';
import { formatKip } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderTracker } from './components/OrderTracker';
import { LocationModal } from './components/LocationModal';

const STORAGE_KEYS = {
  PRODUCTS: 'pos_lao_products_v1',
  ORDERS: 'pos_lao_orders_v1',
  ADMIN_LOGGED_IN: 'pos_lao_admin_logged_in_v1',
  CUSTOMER_LOCATION: 'pos_lao_customer_location_v1'
};

export default function App() {
  // Persistent Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
    } catch {
      return false;
    }
  });

  // Saved Delivery Location
  const [customerLocation, setCustomerLocation] = useState<DeliveryLocation | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_LOCATION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation View: 'store' | 'admin' | 'tracking'
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'tracking'>('store');

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [latestCreatedOrder, setLatestCreatedOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Store Index Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Sync products and orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save admin state:', e);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (customerLocation) {
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_LOCATION, JSON.stringify(customerLocation));
      } catch (e) {
        console.warn('Failed to save location:', e);
      }
    }
  }, [customerLocation]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartTotalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Checkout Handlers
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    // Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stocks from products
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = newOrder.items.find((i) => i.productId === p.id);
        if (ordered) {
          return {
            ...p,
            stock: Math.max(0, p.stock - ordered.quantity)
          };
        }
        return p;
      })
    );

    // Clear cart and show success modal
    setCartItems([]);
    setIsCheckoutOpen(false);
    setLatestCreatedOrder(newOrder);
  };

  // Admin Actions
  const handleAddProduct = (newP: Omit<Product, 'id'>) => {
    const productWithId: Product = {
      ...newP,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const handleUpdateProduct = (updatedP: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedP.id ? updatedP : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtered Products for Index
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#030c20] text-slate-100 flex flex-col font-phetsarath space-sky-bg selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        cartCount={cartTotalItemsCount}
        cartTotal={cartTotalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={() => {
          setIsAdminLoggedIn(false);
          setCurrentView('store');
        }}
        hasLocation={!!customerLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        
        {/* VIEW 1: CUSTOMER FACING STORE (INDEX) */}
        {currentView === 'store' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Banner (Space Sky Blue Atmosphere) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400 p-6 sm:p-10 shadow-2xl border-2 border-cyan-300/60">
              <div className="relative z-10 max-w-2xl text-slate-950 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-cyan-300 rounded-full text-xs font-bold border border-cyan-400/40">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>ລະບົບ POS & ສັ່ງຊື້ອອນໄລ 2026 &bull; Space Blue Theme</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
                  ສັ່ງຊື້ສິນຄ້າອອນໄລ <br />
                  <span className="text-white drop-shadow-md">ຈັດສົ່ງຮອດໜ້າບ້ານທ່ານ</span>
                </h1>

                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  ສະດວກ, ວ່ອງໄວ, ປັກໝຸດ GPS ງ່າຍດາຍ. ຮອງຮັບການຈ່າຍເງິນສົດປາຍທາງ (COD) ແລະ ສະແກນ QR OnePay!
                </p>

                {/* Quick Feature Badges & Red/Blue/Yellow Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {/* Blue Button: Set Location */}
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer border border-blue-400/50"
                  >
                    <span>ດຶງ GPS ຕຳແໜ່ງຂອງທ່ານ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Yellow Button: View Cart */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-4 py-2.5 bg-amber-300 hover:bg-amber-200 text-slate-950 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer border-2 border-amber-400"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-950" />
                    <span>ເບິ່ງກະຕ່າສິນຄ້າ ({cartTotalItemsCount})</span>
                  </button>

                  {/* Red Button: Track order */}
                  <button
                    onClick={() => setCurrentView('tracking')}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer border border-rose-400/50"
                  >
                    <span>ກວດສອບອໍເດີ້</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Star / Graphic Overlay */}
              <div className="absolute right-4 bottom-2 opacity-20 hidden md:block pointer-events-none">
                <div className="text-8xl font-english font-black text-slate-950 tracking-widest">
                  SPACE
                </div>
              </div>
            </div>

            {/* Quick Stats / Highlights Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#05142e] p-3.5 rounded-2xl border border-blue-800/60 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-300">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">ສິນຄ້າພ້ອມສົ່ງ</div>
                  <div className="font-bold text-white text-sm">{products.length} ລາຍການ</div>
                </div>
              </div>

              <div className="bg-[#05142e] p-3.5 rounded-2xl border border-blue-800/60 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">ການຈັດສົ່ງ</div>
                  <div className="font-bold text-white text-sm">ປັກໝຸດ GPS ຮອດບ້ານ</div>
                </div>
              </div>

              <div className="bg-[#05142e] p-3.5 rounded-2xl border border-blue-800/60 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">ຈ່າຍເງິນປາຍທາງ</div>
                  <div className="font-bold text-white text-sm">Cash on Delivery (COD)</div>
                </div>
              </div>

              <div className="bg-[#05142e] p-3.5 rounded-2xl border border-blue-800/60 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">ໂອນຈ່າຍ OnePay</div>
                  <div className="font-bold text-white text-sm">BCEL One QR Code</div>
                </div>
              </div>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ, ບາໂຄດ..."
                    className="w-full bg-[#05142e] border border-blue-700/60 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-white absolute right-3 top-3"
                    >
                      ລ້າງ
                    </button>
                  )}
                </div>

                {/* Category count indicator */}
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span>ພົບເຫັນທັງໝົດ:</span>
                  <span className="font-black text-amber-400 text-sm font-english">
                    {filteredProducts.length} ລາຍການ
                  </span>
                </div>
              </div>

              {/* Category Pills (Space Blue accents) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg scale-105 border-2 border-cyan-300'
                        : 'bg-[#05142e] text-slate-300 hover:bg-blue-900 border border-blue-800/60'
                    }`}
                  >
                    {cat === 'ALL' ? 'ສິນຄ້າທັງໝົດ' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid (Index: ໜ້າຫຼັກສະແດງລາຍການສິນຄ້າທັງໝົດ) */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#05142e] border border-blue-800/60 rounded-3xl text-slate-400 space-y-3">
                <Package className="w-10 h-10 text-cyan-400 mx-auto" />
                <h3 className="text-base font-bold text-white">ບໍ່ພົບສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາ</h3>
                <p className="text-xs text-slate-400">
                  ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ເລືອກໝວດໝູ່ສິນຄ້າອື່ນ
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  ສະແດງສິນຄ້າທັງໝົດ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onPrintReceipt={(order) => setReceiptOrder(order)}
            onExitAdmin={() => setCurrentView('store')}
          />
        )}

        {/* VIEW 3: CUSTOMER ORDER TRACKER */}
        {currentView === 'tracking' && (
          <OrderTracker
            orders={orders}
            onBackToStore={() => setCurrentView('store')}
            onPrintReceipt={(order) => setReceiptOrder(order)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-[#020a1c] border-t border-blue-900/60 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-english font-black text-white text-base">POS LAO SPACE BLUE</span>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                PRO SYSTEM
              </span>
            </div>
            <p className="text-slate-400">
              ລະບົບຂາຍສິນຄ້າ ແລະ ຈັດສົ່ງສິນຄ້າອອນໄລ ພ້ອມແຜນທີ່ GPS ແລະ QR Code
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
            <button
              onClick={() => setCurrentView('store')}
              className="hover:text-cyan-300 transition-colors"
            >
              ໜ້າຫຼັກ (Home)
            </button>
            <button
              onClick={() => setCurrentView('tracking')}
              className="hover:text-cyan-300 transition-colors"
            >
              ຕິດຕາມອໍເດີ້
            </button>
            <button
              onClick={() => {
                if (isAdminLoggedIn) setCurrentView('admin');
                else setIsAdminLoginOpen(true);
              }}
              className="hover:text-cyan-300 transition-colors"
            >
              Admin Dashboard
            </button>
          </div>

          <div className="text-center md:text-right font-english text-slate-500">
            &copy; 2026 POS Lao Space Blue. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
      />

      {/* 2. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        defaultLocation={customerLocation}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. Order Success Modal */}
      <OrderSuccessModal
        order={latestCreatedOrder}
        onClose={() => setLatestCreatedOrder(null)}
        onPrintReceipt={(order) => setReceiptOrder(order)}
        onTrackOrder={() => {
          setLatestCreatedOrder(null);
          setCurrentView('tracking');
        }}
      />

      {/* 5. Printable Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminLoginOpen(false);
          setCurrentView('admin');
        }}
      />

      {/* 7. Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        location={customerLocation}
        onSaveLocation={(loc) => setCustomerLocation(loc)}
      />

    </div>
  );
}
