import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useUser } from './context/UserContext';
import { styles } from './styles';
import { UserIcon, ChevronDownIcon, MenuIcon, HomeIcon, ShoppingBagIcon, ArrowUpIcon, TrashIcon } from './components/Icons';
import { formatPrice } from './utils/formatPrice';
import type { Product, MenuCategory, Screen, DeliveryMode, Cart, CartEntry, PickupLocation, BusinessInfo } from './types';
import { getMenu, authenticateTelegram, authenticateTelegramLogin, createOrder, getBusinessInfo, getProductDetail } from './api';
import type { TelegramLoginData } from './api';
import { isTelegram, getInitData, getPhotoUrl, openPaymentLink } from './telegram';
import TelegramLoginButton from './components/TelegramLoginButton';
import TimePickerModal, { type DeliveryDetails } from './components/TimePickerModal';
import type { CreateOrderRequest } from './types';

import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CashbackScreen from './screens/CashbackScreen';
import ContactScreen from './screens/ContactScreen';
import AboutScreen from './screens/AboutScreen';
import BalanceHistoryScreen from './screens/BalanceHistoryScreen';
import DepositScreen from './screens/DepositScreen';
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
  const { t, i18n } = useTranslation();
  const { user } = useUser();
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
  const [selectedLanguage, setSelectedLanguage] = useState(user?.lang || i18n.language || "uz");
  const [orderTypeModalOpen, setOrderTypeModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<PickupLocation | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [deliveryPosition, setDeliveryPosition] = useState<[number, number]>([42.4619, 59.6166]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("access_token"));
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (user?.lang && selectedLanguage !== user.lang) {
      setSelectedLanguage(user.lang);
      i18n.changeLanguage(user.lang);
    }
  }, [user, i18n]);

  const handleTelegramLogin = async (loginData: TelegramLoginData) => {
    console.log('Telegram login data received:', loginData);
    try {
      const response = await authenticateTelegramLogin(loginData);
      console.log('Telegram login success:', response);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Telegram login failed:', error?.response?.data || error);
    }
  };

  useEffect(() => {
    if (isTelegram()) {
      authenticateTelegram(getInitData())
        .then(() => setIsAuthenticated(true))
        .catch(console.error);
      setPhotoUrl(getPhotoUrl());
    }
    // Fetch business info
    getBusinessInfo()
      .then((info) => {
        setBusinessInfo(info);
        if (info.pickup_locations.length > 0) {
          setSelectedBranch(info.pickup_locations[0]);
        }
        // If delivery is disabled, force pickup mode
        if (!info.delivery_enabled) {
          setDeliveryMode("pickup");
        }
      })
      .catch(console.error);
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

  // Quick add from product grid. If the product has modifier groups AND there
  // is no existing cart entry yet, open the detail modal so the user can
  // choose. Once an entry exists for this product (any modifier combo), the
  // `+` just bumps the quantity of that existing entry — no modal reopening.
  const addToCart = async (id: number) => {
    // Find existing cart entries for this product.
    const existingEntries = Object.entries(cart).filter(([, e]) => e.productId === id);
    if (existingEntries.length > 0) {
      // Bump the (first/only) existing entry — preserves its modifiers.
      const [existingKey, existingEntry] = existingEntries[0];
      setCart((c) => ({
        ...c,
        [existingKey]: { ...existingEntry, quantity: existingEntry.quantity + 1 },
      }));
      return;
    }
    try {
      const detail = await getProductDetail(id);
      if (detail.modifier_groups.length > 0) {
        const product = products.find((p) => p.id === id);
        if (product) setSelectedProduct(product);
        return;
      }
    } catch (err) {
      console.error('Failed to fetch product detail:', err);
    }
    // No modifiers: add fresh entry.
    const key = String(id);
    setCart((c) => ({
      ...c,
      [key]: { productId: id, quantity: 1, modifiers: [], modifierTotal: 0 },
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((c) => {
      // Find the cart entry for this product (honors modifier-based keys).
      const entryKey = Object.keys(c).find((k) => c[k].productId === id);
      if (!entryKey) return c;
      const existing = c[entryKey];
      if (existing.quantity > 1) {
        return { ...c, [entryKey]: { ...existing, quantity: existing.quantity - 1 } };
      }
      const n = { ...c };
      delete n[entryKey];
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

  const handleOrderSubmit = async (
    date: string,
    time: string,
    useCashback: boolean,
    useDeposit: boolean,
    delivery?: DeliveryDetails,
  ) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const items = Object.values(cart).map((entry) => ({
        product_id: entry.productId,
        quantity: entry.quantity,
        modifiers: entry.modifiers.map((m) => ({
          modifier_id: m.modifier_id,
          quantity: m.quantity,
        })),
      }));
      const payload: CreateOrderRequest = {
        pickup_time: `${date}T${time}:00+05:00`,
        total_amount: totalPrice.toFixed(2),
        use_cashback: useCashback,
        use_deposit: useDeposit,
        order_type: deliveryMode,
        items,
        ...(deliveryMode === "pickup" && selectedBranch ? {
          pickup_location_id: selectedBranch.id,
        } : {}),
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
      console.log("ORDER RESULT:", result);
      clearCart();
      setTimePickerOpen(false);
      setScreen("notifications");
      if (result.payment_url) {
        openPaymentLink(result.payment_url);
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

  if (!isTelegram() && !isAuthenticated) {
    return (
      <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h2 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>Zen Coffee</h2>
        <p style={{ marginBottom: 24, color: 'var(--text-secondary)', textAlign: 'center' }}>
          {t('loginWithTelegram')}
        </p>
        <TelegramLoginButton onAuth={handleTelegramLogin} />
      </div>
    );
  }

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
            {deliveryMode === "pickup" ? t('pickup') : t('delivery')} <ChevronDownIcon />
          </button>
        </div>
        <div
          style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => deliveryMode === "delivery" ? setLocationModalOpen(true) : setBranchModalOpen(true)}
        >
          {deliveryMode === "delivery" && deliveryAddress ? deliveryAddress : selectedBranch?.name || t('selectBranch')}
        </div>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(true)}><MenuIcon /></button>
      </div>

      {/* Desktop: flex layout with sidebar */}
      <div className="desktop-layout">
        {/* Main content areaaaaaaaa */}
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
              qrPayload={user?.qr_payload ?? null}
            />
          )}

          {screen === "notifications" && (
            <NotificationsScreen onBack={() => setScreen("home")} />
          )}

          {screen === "profile" && (
            <ProfileScreen
              onBack={() => setScreen("home")}
              photoUrl={photoUrl}
              onCashback={() => setScreen("cashback")}
              onBalanceHistory={() => setScreen("balance")}
              businessInfo={businessInfo}
            />
          )}

          {screen === "cashback" && (
            <CashbackScreen onBack={() => setScreen("profile")} />
          )}

          {screen === "balance" && (
            <BalanceHistoryScreen
              onBack={() => setScreen("profile")}
              onTopUp={() => setScreen("deposit")}
            />
          )}

          {screen === "deposit" && (
            <DepositScreen
              onBack={() => setScreen("balance")}
              balance={user?.deposit_balance ?? null}
            />
          )}

          {screen === "contact" && (
            <ContactScreen onBack={() => setScreen("home")} businessInfo={businessInfo} />
          )}

          {screen === "about" && (
            <AboutScreen onBack={() => setScreen("home")} />
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
              <h2>{t('cart')} {totalItems > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: "#999" }}>({totalItems})</span>}</h2>
              {totalItems > 0 && (
                <button className="desktop-clear-btn" onClick={clearCart}>
                  <TrashIcon />
                  {t('clear')}
                </button>
              )}
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="desktop-sidebar-empty">
              <ShoppingBagIcon />
              <p>{t('cartEmpty')}</p>
              <p style={{ fontSize: 13, color: "#ccc" }}>{t('addProducts')}</p>
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
                        {formatPrice(Number(product.price) + entry.modifierTotal)} {t('som')}
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
                  <span className="desktop-cart-summary-label">{t('total')}</span>
                  <span className="desktop-cart-summary-total">{formatPrice(totalPrice)} {t('som')}</span>
                </div>
                <button className="desktop-checkout-btn" onClick={handleCheckout}>
                  {t('checkout')}
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
            <span>{t('orderValue')}</span>
            <span style={{ fontWeight: 700 }}>{formatPrice(totalPrice)}</span>
          </div>
          {screen === "home" ? (
            <button style={styles.cartButton} onClick={() => setScreen("cart")}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBagIcon />
                <span>{t('cart')}</span>
              </div>
              <span>{formatPrice(totalPrice)}</span>
            </button>
          ) : (
            <button style={styles.cartButton} onClick={handleCheckout}>
              <span>{t('checkout')}</span>
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
          onContact={() => { setScreen("contact"); setMenuOpen(false); }}
          onAbout={() => { setScreen("about"); setMenuOpen(false); }}
          onBalanceHistory={() => { setScreen("balance"); setMenuOpen(false); }}
          onCashback={() => { setScreen("cashback"); setMenuOpen(false); }}
        />
      )}

      {languageModalOpen && (
        <LanguageModal
          selectedLanguage={selectedLanguage}
          onSelect={(code) => { 
            setSelectedLanguage(code); 
            i18n.changeLanguage(code);
            setLanguageModalOpen(false); 
          }}
          onClose={() => setLanguageModalOpen(false)}
        />
      )}

      {orderTypeModalOpen && businessInfo && (
        <OrderTypeModal
          deliveryMode={deliveryMode}
          deliveryEnabled={businessInfo.delivery_enabled}
          deliveryFee={businessInfo.delivery_fee}
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

      {branchModalOpen && businessInfo && selectedBranch && (
        <BranchModal
          selectedBranch={selectedBranch}
          branches={businessInfo.pickup_locations}
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
          cashbackBalance={user?.balance ?? null}
          depositBalance={user?.deposit_balance ?? null}
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
