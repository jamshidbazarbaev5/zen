import { useState, useEffect } from "react";
import { styles } from './styles';
import { UserIcon, ChevronDownIcon, MenuIcon, HomeIcon, ShoppingBagIcon, ArrowUpIcon, TrashIcon } from './components/Icons';
import { BRANCHES } from './data/constants';
import { formatPrice } from './utils/formatPrice';
import type { Product, MenuCategory, Screen, DeliveryMode, Branch, Cart, CartEntry } from './types';
import { getMenu, authenticateTelegram, createOrder } from './api';
import { isTelegram, getInitData, getPhotoUrl } from './telegram';
import TimePickerModal, { type DeliveryDetails } from './components/TimePickerModal';
import type { CreateOrderRequest } from './types';

import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CashbackScreen from './screens/CashbackScreen';
import ProductDetailModal from './components/ProductDetailModal';
import MenuSidebar from './components/MenuSidebar';
import LanguageModal from './components/LanguageModal';
import OrderTypeModal from './components/OrderTypeModal';
import BranchModal from './components/BranchModal';
import LocationModal from './components/LocationModal';

// Generate a cart key from product id + modifiers
const cartKey = (productId: number, modifiers: { modifier_id: number; quantity: number }[]): string => {
  if (modifiers.length === 0) return String(productId);
  const sorted = [...modifiers].sort((a, b) => a.modifier_id - b.modifier_id);
  return `${productId}_${sorted.map((m) => m.modifier_id).join("-")}`;
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState<Cart>({});
  const [, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("uz");
  const [orderTypeModalOpen, setOrderTypeModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [deliveryPosition, setDeliveryPosition] = useState<[number, number]>([42.4619, 59.6166]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (isTelegram()) {
      authenticateTelegram(getInitData()).catch(console.error);
      setPhotoUrl(getPhotoUrl());
    }
  }, []);

  useEffect(() => {
    if (selectedProduct || menuOpen || languageModalOpen || orderTypeModalOpen || branchModalOpen || locationModalOpen || timePickerOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => { document.body.classList.remove('modal-open'); };
  }, [selectedProduct, menuOpen, languageModalOpen, orderTypeModalOpen, branchModalOpen, locationModalOpen, timePickerOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const lang = ["uz", "ru", "en", "kk"].includes(selectedLanguage) ? selectedLanguage : "ru";
    setLoading(true);
    const applyData = (data: MenuCategory[]) => {
      setCategories(data);
      const allProducts: Product[] = data.flatMap((cat) =>
        cat.products.map((p) => ({ ...p, category: cat.name }))
      );
      setProducts(allProducts);
      if (data.length > 0 && (!activeCategory || !data.some((c) => c.name === activeCategory))) {
        setActiveCategory(data[0].name);
      }
    };

    getMenu(lang)
      .then((data) => {
        if (data.length > 0) {
          applyData(data);
        } else if (lang !== "ru") {
          return getMenu("ru").then(applyData);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLanguage]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredProducts = products.filter(
    (p) => p.category === activeCategory && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick add (no modifiers) from product grid
  const addToCart = (id: number) => {
    const key = String(id);
    setCart((c) => {
      const existing = c[key];
      if (existing) {
        return { ...c, [key]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...c, [key]: { productId: id, quantity: 1, modifiers: [], modifierTotal: 0 } };
    });
  };

  const removeFromCart = (id: number) => {
    const key = String(id);
    setCart((c) => {
      const existing = c[key];
      if (!existing) return c;
      if (existing.quantity > 1) {
        return { ...c, [key]: { ...existing, quantity: existing.quantity - 1 } };
      }
      const n = { ...c };
      delete n[key];
      return n;
    });
  };

  // Add from product detail modal (with modifiers)
  const addEntryToCart = (entry: CartEntry) => {
    const key = cartKey(entry.productId, entry.modifiers);
    setCart((c) => {
      const existing = c[key];
      if (existing) {
        return { ...c, [key]: { ...existing, quantity: existing.quantity + entry.quantity } };
      }
      return { ...c, [key]: entry };
    });
  };

  // Remove a specific cart entry by key
  const removeCartEntry = (key: string) => {
    setCart((c) => {
      const existing = c[key];
      if (!existing) return c;
      if (existing.quantity > 1) {
        return { ...c, [key]: { ...existing, quantity: existing.quantity - 1 } };
      }
      const n = { ...c };
      delete n[key];
      return n;
    });
  };

  const addCartEntry = (key: string) => {
    setCart((c) => {
      const existing = c[key];
      if (!existing) return c;
      return { ...c, [key]: { ...existing, quantity: existing.quantity + 1 } };
    });
  };

  const clearCart = () => setCart({});

  // Legacy cart format for HomeScreen (productId -> total qty)
  const simpleCart: Record<number, number> = {};
  Object.values(cart).forEach((entry) => {
    simpleCart[entry.productId] = (simpleCart[entry.productId] || 0) + entry.quantity;
  });

  const handleCheckout = () => setTimePickerOpen(true);

  const handleOrderSubmit = async (time: string, delivery?: DeliveryDetails) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const items = Object.values(cart).map((entry) => ({
        product_id: entry.productId,
        quantity: entry.quantity,
        modifiers: entry.modifiers.map((m) => ({
          modifier_id: m.modifier_id,
          quantity: m.quantity,
        })),
      }));
      const payload: CreateOrderRequest = {
        pickup_time: `${today}T${time}:00+05:00`,
        total_amount: totalPrice.toFixed(2),
        use_balance: false,
        order_type: deliveryMode,
        items,
        ...(deliveryMode === "delivery" ? {
          delivery_address: deliveryAddress,
          delivery_latitude: deliveryPosition[0],
          delivery_longitude: deliveryPosition[1],
          delivery_flat: delivery?.flat || "",
          delivery_entrance: delivery?.entrance || "",
          delivery_floor: delivery?.floor || "",
          delivery_comment: delivery?.comment || "",
        } : {}),
      };
      console.log("ORDER PAYLOAD:", JSON.stringify(payload, null, 2));
      const result = await createOrder(payload);
      clearCart();
      setTimePickerOpen(false);
      setScreen("notifications");
      if (result.payment_url) {
        window.open(result.payment_url, "_blank");
      }
    } catch (err: any) {
      const respMsg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message || String(err);
      console.error("ORDER ERROR:", err?.response?.status, respMsg);
      setOrderError("Error " + (err?.response?.status || "?") + ": " + respMsg);
    } finally {
      setOrderLoading(false);
    }
  };

  const totalPrice = Object.values(cart).reduce((sum, entry) => {
    const p = products.find((x) => x.id === entry.productId);
    if (!p) return sum;
    return sum + (Number(p.price) + entry.modifierTotal) * entry.quantity;
  }, 0);

  const totalItems = Object.values(cart).reduce((a, e) => a + e.quantity, 0);

  const cartProducts = Object.entries(cart).map(([key, entry]) => ({
    key,
    product: products.find((x) => x.id === entry.productId)!,
    entry,
  }));

  return (
    <div style={styles.container} className="app-container">
      {/* Profile & Delivery */}
      <div style={styles.profileRow} className="profile-row">
        <div style={{ ...styles.avatar, cursor: "pointer" }} onClick={() => setScreen("profile")}>
          {photoUrl ? (
            <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <UserIcon />
          )}
        </div>
        <div style={styles.deliveryToggle}>
          <button
            onClick={() => setOrderTypeModalOpen(true)}
            style={deliveryMode === "pickup" ? styles.deliveryActive : styles.deliveryBtn}
          >
            {deliveryMode === "pickup" ? "Olib ketish" : "Yetkazib berish"} <ChevronDownIcon />
          </button>
        </div>
        <div
          style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => deliveryMode === "delivery" ? setLocationModalOpen(true) : setBranchModalOpen(true)}
        >
          {deliveryMode === "delivery" && deliveryAddress ? deliveryAddress : selectedBranch.name}
        </div>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(true)}><MenuIcon /></button>
      </div>

      {/* Desktop: flex layout with sidebar */}
      <div className="desktop-layout">
        {/* Main content area */}
        <div className="desktop-main">
          {screen === "home" && (
            <HomeScreen
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProducts={filteredProducts}
              categories={categories.map((c) => c.name)}
              cart={simpleCart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              onProductSelect={setSelectedProduct}
            />
          )}

          {screen === "notifications" && (
            <NotificationsScreen onBack={() => setScreen("home")} />
          )}

          {screen === "profile" && (
            <ProfileScreen onBack={() => setScreen("home")} photoUrl={photoUrl} onCashback={() => setScreen("cashback")} />
          )}

          {screen === "cashback" && (
            <CashbackScreen onBack={() => setScreen("profile")} />
          )}

          {screen === "cart" && (
            <div className="mobile-cart-screen">
              <CartScreen
                cartProducts={cartProducts.map(({ key, product, entry }) => ({
                  key,
                  product,
                  qty: entry.quantity,
                  modifiers: entry.modifiers,
                  modifierTotal: entry.modifierTotal,
                }))}
                onBack={() => setScreen("home")}
                onClear={clearCart}
                addToCart={addCartEntry}
                removeFromCart={removeCartEntry}
              />
            </div>
          )}
        </div>

        {/* Desktop sidebar cart */}
        <div className="desktop-sidebar">
          <div className="desktop-sidebar-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Savat {totalItems > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: "#999" }}>({totalItems})</span>}</h2>
              {totalItems > 0 && (
                <button className="desktop-clear-btn" onClick={clearCart}>
                  <TrashIcon />
                  Tozalash
                </button>
              )}
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="desktop-sidebar-empty">
              <ShoppingBagIcon />
              <p>Savatingiz hali bo'sh</p>
              <p style={{ fontSize: 13, color: "#ccc" }}>Mahsulotlarni qo'shing</p>
            </div>
          ) : (
            <>
              <div className="desktop-cart-items">
                {cartProducts.map(({ key, product, entry }) => (
                  <div key={key} className="desktop-cart-item">
                    <img src={product.image_url} alt={product.name} />
                    <div className="desktop-cart-item-info">
                      <div className="desktop-cart-item-name">{product.name}</div>
                      {entry.modifiers.length > 0 && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          +{formatPrice(entry.modifierTotal)}
                        </div>
                      )}
                      <div className="desktop-cart-item-price">
                        {formatPrice(Number(product.price) + entry.modifierTotal)} so'm
                      </div>
                    </div>
                    <div className="desktop-cart-item-controls">
                      <button onClick={() => removeCartEntry(key)}>-</button>
                      <span>{entry.quantity}</span>
                      <button onClick={() => addCartEntry(key)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="desktop-cart-footer">
                <div className="desktop-cart-summary">
                  <span className="desktop-cart-summary-label">Jami:</span>
                  <span className="desktop-cart-summary-total">{formatPrice(totalPrice)} so'm</span>
                </div>
                <button className="desktop-checkout-btn" onClick={handleCheckout}>
                  Buyurtmani rasmiylashtirish
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Home FAB (mobile only) */}
      {screen === "cart" && (
        <button style={styles.homeFab} onClick={() => setScreen("home")} className="home-fab"><HomeIcon /></button>
      )}

      {/* Mobile Cart Bar */}
      {totalItems > 0 && (
        <div style={styles.cartBar} className="mobile-cart-bar">
          <div style={styles.cartInfo}>
            <span>Buyurtma qiymati:</span>
            <span style={{ fontWeight: 700 }}>{formatPrice(totalPrice)}</span>
          </div>
          {screen === "home" ? (
            <button style={styles.cartButton} onClick={() => setScreen("cart")}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBagIcon />
                <span>Savat</span>
              </div>
              <span>{formatPrice(totalPrice)}</span>
            </button>
          ) : (
            <button style={styles.cartButton} onClick={handleCheckout}>
              <span>Buyurtmani rasmiylashtirish</span>
              <span>{formatPrice(totalPrice)}</span>
            </button>
          )}
        </div>
      )}

      {/* MODALS */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addEntryToCart}
        />
      )}

      {menuOpen && (
        <MenuSidebar
          selectedLanguage={selectedLanguage}
          theme={theme}
          onClose={() => setMenuOpen(false)}
          onBranchOpen={() => setBranchModalOpen(true)}
          onLanguageOpen={() => setLanguageModalOpen(true)}
          onToggleTheme={toggleTheme}
          onNotifications={() => { setScreen("notifications"); setMenuOpen(false); }}
        />
      )}

      {languageModalOpen && (
        <LanguageModal
          selectedLanguage={selectedLanguage}
          onSelect={(code) => { setSelectedLanguage(code); setLanguageModalOpen(false); }}
          onClose={() => setLanguageModalOpen(false)}
        />
      )}

      {orderTypeModalOpen && (
        <OrderTypeModal
          deliveryMode={deliveryMode}
          onSelectDelivery={() => {
            setDeliveryMode("delivery");
            setOrderTypeModalOpen(false);
            setLocationModalOpen(true);
          }}
          onSelectPickup={() => {
            setDeliveryMode("pickup");
            setOrderTypeModalOpen(false);
            setBranchModalOpen(true);
          }}
          onClose={() => setOrderTypeModalOpen(false)}
        />
      )}

      {branchModalOpen && (
        <BranchModal
          selectedBranch={selectedBranch}
          onSelect={(branch) => { setSelectedBranch(branch); setBranchModalOpen(false); }}
          onClose={() => setBranchModalOpen(false)}
        />
      )}

      {locationModalOpen && (
        <LocationModal
          position={deliveryPosition}
          address={deliveryAddress}
          onPositionChange={setDeliveryPosition}
          onAddressChange={setDeliveryAddress}
          onClose={() => setLocationModalOpen(false)}
        />
      )}

      {timePickerOpen && (
        <TimePickerModal
          onConfirm={handleOrderSubmit}
          onClose={() => { setTimePickerOpen(false); setOrderError(null); }}
          loading={orderLoading}
          error={orderError}
          isDelivery={deliveryMode === "delivery"}
        />
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button style={styles.scrollTopBtn} onClick={scrollToTop} className="scroll-top-btn">
          <ArrowUpIcon />
        </button>
      )}
    </div>
  );
};

export default Index;
