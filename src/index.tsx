import { useState, useEffect } from "react";
import { styles } from './styles';
import { UserIcon, ChevronDownIcon, MenuIcon, HomeIcon, ShoppingBagIcon, ArrowUpIcon } from './components/Icons';
import { MOCK_PRODUCTS } from './data/products';
import { BRANCHES } from './data/constants';
import { formatPrice } from './utils/formatPrice';
import type { Product, Screen, DeliveryMode, Branch } from './types';

import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ProductDetailModal from './components/ProductDetailModal';
import MenuSidebar from './components/MenuSidebar';
import LanguageModal from './components/LanguageModal';
import OrderTypeModal from './components/OrderTypeModal';
import BranchModal from './components/BranchModal';
import LocationModal from './components/LocationModal';

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeCategory, setActiveCategory] = useState("Kombo");
  const [cart, setCart] = useState<Record<number, number>>({});
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
  const [deliveryPosition, setDeliveryPosition] = useState<[number, number]>([42.4619, 59.6166]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    if (selectedProduct || menuOpen || languageModalOpen || orderTypeModalOpen || branchModalOpen || locationModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => { document.body.classList.remove('modal-open'); };
  }, [selectedProduct, menuOpen, languageModalOpen, orderTypeModalOpen, branchModalOpen, locationModalOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === activeCategory && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id: number) =>
    setCart((c) => {
      const n = { ...c };
      if (n[id] > 1) n[id]--;
      else delete n[id];
      return n;
    });
  const clearCart = () => setCart({});

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = MOCK_PRODUCTS.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartProducts = Object.entries(cart).map(([id, qty]) => ({
    product: MOCK_PRODUCTS.find((x) => x.id === Number(id))!,
    qty,
  }));

  return (
    <div style={styles.container}>
      {/* Profile & Delivery */}
      <div style={styles.profileRow}>
        <div style={styles.avatar}><UserIcon /></div>
        <div style={styles.deliveryToggle}>
          <button
            onClick={() => setOrderTypeModalOpen(true)}
            style={deliveryMode === "pickup" ? styles.deliveryActive : styles.deliveryBtn}
          >
            {deliveryMode === "pickup" ? "Olib ketish" : "Yetkazib berish"} <ChevronDownIcon />
          </button>
        </div>
        <div
          style={{ textAlign: "center", fontSize: 12, color: "#666", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => deliveryMode === "delivery" ? setLocationModalOpen(true) : setBranchModalOpen(true)}
        >
          {deliveryMode === "delivery" && deliveryAddress ? deliveryAddress : selectedBranch.name}
        </div>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(true)}><MenuIcon /></button>
      </div>

      {/* HOME SCREEN */}
      {screen === "home" && (
        <HomeScreen
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredProducts={filteredProducts}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onProductSelect={setSelectedProduct}
        />
      )}

      {/* CART SCREEN */}
      {screen === "cart" && (
        <CartScreen
          cartProducts={cartProducts}
          onBack={() => setScreen("home")}
          onClear={clearCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}

      {/* Home FAB */}
      {screen === "cart" && (
        <button style={styles.homeFab} onClick={() => setScreen("home")}><HomeIcon /></button>
      )}

      {/* Cart Bar */}
      {totalItems > 0 && (
        <div style={styles.cartBar}>
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
            <button style={styles.cartButton}>
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
          quantity={cart[selectedProduct.id] || 0}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
          onRemove={removeFromCart}
        />
      )}

      {menuOpen && (
        <MenuSidebar
          selectedLanguage={selectedLanguage}
          onClose={() => setMenuOpen(false)}
          onBranchOpen={() => setBranchModalOpen(true)}
          onLanguageOpen={() => setLanguageModalOpen(true)}
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
