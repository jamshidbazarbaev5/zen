import { useState, useEffect } from "react";
import combo1 from './assets/combo1.jpg'
import { Check } from 'lucide-react';
import coffee  from './assets/coffee.webp'

// SVG Icons as components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const MoreVertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BurgerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 11h20M2 11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2M2 11v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
    <path d="M6 9V6a6 6 0 0 1 12 0v3" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "KIDS COMBO", price: 73000, category: "Kombo", image: coffee, description: "Mini burger Pops Kids sok Super qahramon Sousni mijozning ko'ngliga qarab tanlash imkoniyat bor" },
  { id: 2, name: "KAMTAR COMBO", price: 35000, category: "Kombo", image: coffee, description: "Hot-dog kartoshka fri va ichimlik bilan" },
  { id: 3, name: "OILAVIY COMBO", price: 120000, category: "Kombo", image: coffee, description: "2 ta burger, 2 kartoshka fri, 2 ichimlik" },
  { id: 4, name: "MEGA COMBO", price: 95000, category: "Kombo", image: coffee, description: "Katta burger, kartoshka fri, ichimlik va desert" },
  { id: 5, name: "CLASSIC LAVASH", price: 28000, category: "Lavash", image: coffee, description: "Go'sht, sabzavotlar va maxsus sous bilan" },
  { id: 6, name: "CHICKEN LAVASH", price: 32000, category: "Lavash", image: coffee, description: "Tovuq go'shti, sabzavotlar va sarimsoqli sous" },
  { id: 7, name: "CLASSIC BURGER", price: 25000, category: "Burger", image: coffee, description: "Go'sht kotleti, pishloq, salat va pomidor" },
  { id: 8, name: "DOUBLE BURGER", price: 40000, category: "Burger", image: coffee, description: "Ikki go'sht kotleti, ikki pishloq, salat" },
  { id: 9, name: "CLASSIC HOT-DOG", price: 18000, category: "Xot-dog", image: coffee, description: "Sosiska, gorchitsa va ketchup bilan" },
  { id: 10, name: "DOUBLE HOT-DOG", price: 25000, category: "Xot-dog", image: coffee, description: "Ikki sosiska va maxsus sous bilan" },
  { id: 11, name: "COCA-COLA 0.5L", price: 8000, category: "Senchalar", image: coffee, description: "Sovuq Coca-Cola 0.5 litr" },
  { id: 12, name: "FANTA 0.5L", price: 8000, category: "Senchalar", image: coffee, description: "Sovuq Fanta 0.5 litr" },
];

const CATEGORIES = ["Kombo", "Lavash", "Burger", "Xot-dog", "Senchalar"];

const MENU_ITEMS = [
  { icon: <HomeIcon />, label: "Bosh sahifa" },
  { icon: <TagIcon />, label: "Aksiyalar" },
  { icon: <BellIcon />, label: "Xabarnoma" },
  { icon: <InfoIcon />, label: "Biz haqimizda" },
  { icon: <MapPinIcon />, label: "Filiallar" },
  { icon: <BriefcaseIcon />, label: "Ish o'rinlari" },
  { icon: <TruckIcon />, label: "Yetkazib berish" },
  { icon: <MailIcon />, label: "Biz bilan bog'lanish" },
];

type Screen = "home" | "cart";

const LANGUAGES = [
  { code: "uz", name: "O'zbekcha", icon: "🇺🇿" },
  { code: "ru", name: "Русский", icon: "🇷🇺" },
  { code: "en", name: "English", icon: "🇬🇧" },
];

const BRANCHES = [
  { id: 1, name: "01 Algoritm - Feed up", address: "Chilonzor tumani, Algoritm ko'chasi" },
  { id: 2, name: "02 Sergeli - Feed up", address: "Sergeli tumani, Yangi Sergeli" },
  { id: 3, name: "03 Yunusobod - Feed up", address: "Yunusobod tumani, Amir Temur shox ko'chasi" },
  { id: 4, name: "04 Mirzo Ulug'bek - Feed up", address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li" },
];

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeCategory, setActiveCategory] = useState("Kombo");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("pickup");
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("uz");
  const [orderTypeModalOpen, setOrderTypeModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProduct || menuOpen || languageModalOpen || orderTypeModalOpen || branchModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProduct, menuOpen, languageModalOpen, orderTypeModalOpen, branchModalOpen]);

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

  const formatPrice = (n: number) => n.toLocaleString("uz-UZ").replace(/,/g, " ");

  return (
    <div style={styles.container}>
      {/* Header */}
      {/*<div style={styles.header}>*/}
      {/*  /!*<div style={styles.headerLeft}>*!/*/}
      {/*  /!*  <BurgerIcon />*!/*/}
      {/*  /!*  <span style={styles.headerTitle}>FeedUp Bot</span>*!/*/}
      {/*  /!*</div>*!/*/}
      {/*  /!*<div style={styles.headerRight}>*!/*/}
      {/*  /!*  <button style={styles.iconBtn}><MoreVertIcon /></button>*!/*/}
      {/*  /!*  <button style={styles.iconBtn}><CloseIcon /></button>*!/*/}
      {/*  /!*</div>*!/*/}
      {/*</div>*/}

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
        <div style={{ textAlign: "center", fontSize: 12, color: "#666" }}>{selectedBranch.name}</div>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(true)}><MenuIcon /></button>
      </div>

      {/* ============ HOME SCREEN ============ */}
      {screen === "home" && (
        <>
          {/* Search */}
          <div style={styles.searchBox}>
            <SearchIcon />
            <input
              style={styles.searchInput}
              placeholder="Qidirish"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={activeCategory === cat ? styles.catActive : styles.catBtn}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section Title */}
          <h1 style={styles.sectionTitle}>{activeCategory}</h1>

          {/* Products Grid */}
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={styles.card}>
                <div style={styles.cardImageWrap} onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} alt={product.name} style={styles.cardImage} loading="lazy" />
                  {cart[product.id] ? (
                    <div style={styles.cardCounter}>
                      <button style={styles.counterBtn} onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }}>−</button>
                      <span style={styles.counterNum}>{cart[product.id]}</span>
                      <button style={styles.counterBtn} onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}>+</button>
                    </div>
                  ) : (
                    <button style={styles.addBtn} onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}>+</button>
                  )}
                </div>
                <div style={styles.cardPrice}>{formatPrice(product.price)}</div>
                <div style={styles.cardName}>{product.name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ============ CART SCREEN ============ */}
      {screen === "cart" && (
        <div style={{ padding: "0 16px" }}>
          {/* Cart Header */}
          <div style={styles.cartHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={styles.backBtn} onClick={() => setScreen("home")}><ArrowLeftIcon /></button>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#222" }}>Savat</h2>
            </div>
            <button style={styles.clearCartBtn} onClick={clearCart}>
              <TrashIcon />
              <span style={{ color: "#e74c3c", fontSize: 15 }}>Savatni tozalash</span>
            </button>
          </div>

          {/* Cart Items */}
          {cartProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>
              Savat bo'sh
            </div>
          )}
          {cartProducts.map(({ product, qty }) => (
            <div key={product.id} style={styles.cartItem}>
              <img src={product.image} alt={product.name} style={styles.cartItemImage} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#222" }}>{product.name}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#222", marginTop: 4 }}>{formatPrice(product.price)}</div>
              </div>
              <div style={styles.cartItemControls}>
                <button style={styles.cartControlBtn} onClick={() => removeFromCart(product.id)}>
                  <TrashIcon />
                </button>
                <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button style={styles.cartControlBtnPlus} onClick={() => addToCart(product.id)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Home FAB (visible on cart screen) */}
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
              <span>Savat</span>
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalImageWrap}>
              <button style={styles.modalFav}><HeartIcon /></button>
              <button style={styles.modalClose} onClick={() => setSelectedProduct(null)}><CloseIcon /></button>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={styles.modalImage} />
            </div>
            <div style={styles.modalBody}>
              <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
              <p style={styles.modalDesc}>{selectedProduct.description}</p>
              <div style={styles.modalCounter}>
                <button style={styles.counterBtnLg} onClick={() => removeFromCart(selectedProduct.id)}>−</button>
                <span style={styles.counterNumLg}>{cart[selectedProduct.id] || 0}</span>
                <button style={styles.counterBtnLg} onClick={() => addToCart(selectedProduct.id)}>+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ MENU SIDEBAR ============ */}
      {menuOpen && (
        <div style={styles.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div style={styles.menuPanel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.menuHeader}>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#222" }}>Menyu</h2>
              <button style={styles.menuCloseBtn} onClick={() => setMenuOpen(false)}><CloseIcon /></button>
            </div>
            <div style={styles.menuList}>
              {MENU_ITEMS.map((item, i) => (
                <div key={i}>
                  <button 
                    style={styles.menuItem} 
                    onClick={() => {
                      if (item.label === "Filiallar") {
                        setBranchModalOpen(true);
                      }
                      setMenuOpen(false);
                    }}
                  >
                    <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span style={{ fontSize: 17, color: "#222" }}>{item.label}</span>
                  </button>
                  {i < MENU_ITEMS.length - 1 && <div style={styles.menuDivider} />}
                </div>
              ))}
              <div style={styles.menuDivider} />
              <div style={styles.menuItemRow} onClick={() => { setLanguageModalOpen(true); setMenuOpen(false); }}>
                <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><GlobeIcon /></span>
                <span style={{ fontSize: 17, color: "#222", flex: 1 }}>Til</span>
                <span style={{ fontSize: 15, color: "#999" }}>
                  {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                </span>
              </div>
              <div style={styles.menuDivider} />
              <div style={styles.menuItemRow}>
                <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PaletteIcon /></span>
                <span style={{ fontSize: 17, color: "#222", flex: 1 }}>Mavzu</span>
                <span style={{ fontSize: 15, color: "#999" }}>Kunduzgi</span>
              </div>
              <div style={styles.menuDivider} />
              <div style={styles.menuItemRow}>
                <span style={{ width: 32, opacity: 0.6, display: 'flex', alignItems: 'center' }}><PhoneIcon /></span>
                <span style={{ fontSize: 17, color: "#222" }}>+998 71 200 22 11</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ LANGUAGE SELECTION MODAL (Image 7 - Light Mode) ============ */}
      {languageModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setLanguageModalOpen(false)}>
          <div style={styles.languageModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.languageHeader}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Tilni tanlang</h2>
              <button style={styles.modalCloseBtn} onClick={() => setLanguageModalOpen(false)}><CloseIcon /></button>
            </div>
            <div style={styles.languageList}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  style={selectedLanguage === lang.code ? styles.languageItemActive : styles.languageItem}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setLanguageModalOpen(false);
                  }}
                >
                  <div style={styles.languageIconCircle}>
                    <GlobeIcon />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: selectedLanguage === lang.code ? 600 : 400, flex: 1 }}>
                    {lang.name}
                  </span>
                  {selectedLanguage === lang.code && (
                    <Check size={24} color="#e74c3c" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ ORDER TYPE MODAL (Image 8) ============ */}
      {orderTypeModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setOrderTypeModalOpen(false)}>
          <div style={styles.orderTypeModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.orderTypeHeader}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Buyurtma turini tanlang</h2>
              <button style={styles.modalCloseBtn} onClick={() => setOrderTypeModalOpen(false)}><CloseIcon /></button>
            </div>
            <div style={styles.orderTypeList}>
              <button
                style={deliveryMode === "delivery" ? styles.orderTypeItemActive : styles.orderTypeItem}
                onClick={() => {
                  setDeliveryMode("delivery");
                  setOrderTypeModalOpen(false);
                }}
              >
                <div style={styles.orderTypeIcon}>
                  <TruckIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#222" }}>Yetkazib berish</div>
                  <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>Manzilingizga yetkazib beramiz</div>
                </div>
                {deliveryMode === "delivery" && (
                  <Check size={28} color="#e74c3c" strokeWidth={2.5} />
                )}
              </button>
              <button
                style={deliveryMode === "pickup" ? styles.orderTypeItemActive : styles.orderTypeItem}
                onClick={() => {
                  setDeliveryMode("pickup");
                  setOrderTypeModalOpen(false);
                  setBranchModalOpen(true);
                }}
              >
                <div style={styles.orderTypeIcon}>
                  <MapPinIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#222" }}>Olib ketish</div>
                  <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>Filialni tanlang va olib keting</div>
                </div>
                {deliveryMode === "pickup" && (
                  <Check size={28} color="#e74c3c" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ BRANCH SELECTION MODAL (Image 9) ============ */}
      {branchModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setBranchModalOpen(false)}>
          <div style={styles.branchModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.branchHeader}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Filialni tanlang</h2>
              <button style={styles.modalCloseBtn} onClick={() => setBranchModalOpen(false)}><CloseIcon /></button>
            </div>
            <div style={styles.branchList}>
              {BRANCHES.map((branch) => (
                <button
                  key={branch.id}
                  style={selectedBranch.id === branch.id ? styles.branchItemActive : styles.branchItem}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setBranchModalOpen(false);
                  }}
                >
                  <div style={styles.branchIcon}>
                    <MapPinIcon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "#222" }}>{branch.name}</div>
                    <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>{branch.address}</div>
                  </div>
                  {selectedBranch.id === branch.id && (
                    <Check size={28} color="#e74c3c" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 480, margin: "0 auto", background: "#fff", minHeight: "100vh", fontFamily: "'Inter', 'Poppins', sans-serif", position: "relative", paddingBottom: 140 },
  header: { background: "#333", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: 700 },
  headerRight: { display: "flex", gap: 16 },
  iconBtn: { background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center" },
  profileRow: { display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: "#f0e6d3", border: "2px solid #c9a96e", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e" },
  deliveryToggle: { flex: 1 },
  deliveryBtn: { background: "none", border: "none", fontSize: 14, color: "#666", cursor: "pointer", padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 },
  deliveryActive: { background: "none", border: "none", fontSize: 14, color: "#333", fontWeight: 600, cursor: "pointer", padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 },
  menuBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center" },
  searchBox: { margin: "0 16px 12px", background: "#f2f2f2", borderRadius: 12, display: "flex", alignItems: "center", padding: "12px 16px", gap: 10, color: "#999" },
  searchInput: { border: "none", background: "none", outline: "none", fontSize: 16, flex: 1, color: "#333" },
  categories: { display: "flex", gap: 8, padding: "0 16px 16px", overflowX: "auto" },
  catBtn: { background: "none", border: "none", fontSize: 15, color: "#666", cursor: "pointer", padding: "8px 16px", borderRadius: 20, whiteSpace: "nowrap", transition: "all 0.2s ease" },
  catActive: { background: "#e74c3c", color: "#fff", border: "none", fontSize: 15, cursor: "pointer", padding: "8px 20px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.2s ease" },
  sectionTitle: { fontSize: 28, fontWeight: 700, padding: "0 16px 16px", margin: 0, color: "#222" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 16px" },
  card: { cursor: "pointer" },
  cardImageWrap: { position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: "#f5f5f5" },
  cardImage: { width: "100%", height: "100%", objectFit: "cover" },
  addBtn: { position: "absolute", bottom: 8, right: 8, width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease", animation: "scaleIn 0.3s ease" },
  cardCounter: { position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 24, padding: "4px 8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", animation: "scaleIn 0.3s ease" },
  counterBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: "4px 12px", color: "#333", transition: "transform 0.1s ease" },
  counterNum: { fontSize: 16, fontWeight: 600 },
  cardPrice: { fontSize: 20, fontWeight: 700, marginTop: 8, color: "#222" },
  cardName: { fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  cartBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #eee", padding: "12px 16px", zIndex: 100 },
  cartInfo: { display: "flex", justifyContent: "space-between", fontSize: 15, color: "#333", marginBottom: 8 },
  cartButton: { width: "100%", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 17, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", transition: "background 0.2s ease" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", animation: "fadeIn 0.3s ease" },
  modal: { background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "90vh", overflow: "auto", maxWidth: 480, width: "100%", margin: "0 auto", animation: "slideUp 0.3s ease" },
  modalImageWrap: { position: "relative", width: "100%", aspectRatio: "1", background: "#f5f5f5" },
  modalImage: { width: "100%", height: "100%", objectFit: "cover" },
  modalFav: { position: "absolute", top: 16, left: 16, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", color: "#e74c3c", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease" },
  modalClose: { position: "absolute", top: 16, right: 16, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease" },
  modalBody: { padding: "20px 16px 32px" },
  modalTitle: { fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "#222" },
  modalDesc: { fontSize: 15, color: "#666", margin: "0 0 20px", lineHeight: 1.5 },
  modalCounter: { display: "inline-flex", alignItems: "center", gap: 0, background: "#f2f2f2", borderRadius: 30, overflow: "hidden" },
  counterBtnLg: { background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: "10px 20px", color: "#333", transition: "background 0.2s ease" },
  counterNumLg: { fontSize: 18, fontWeight: 600, minWidth: 30, textAlign: "center" },
  // Cart screen styles
  cartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "none" },
  backBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#222", padding: 0, display: "flex", alignItems: "center" },
  clearCartBtn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #eee", borderRadius: 24, padding: "8px 16px", cursor: "pointer", color: "#e74c3c", transition: "all 0.2s ease" },
  cartItem: { display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "1px solid #f0f0f0" },
  cartItemImage: { width: 80, height: 80, borderRadius: 12, objectFit: "cover", background: "#f5f5f5" },
  cartItemControls: { display: "flex", alignItems: "center", gap: 8 },
  cartControlBtn: { width: 40, height: 40, borderRadius: "50%", background: "none", border: "1px solid #eee", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c", transition: "all 0.2s ease" },
  cartControlBtnPlus: { width: 40, height: 40, borderRadius: "50%", background: "none", border: "1px solid #eee", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#222", transition: "all 0.2s ease" },
  homeFab: { position: "fixed", bottom: 160, left: "50%", transform: "translateX(-50%)", marginLeft: -200, width: 56, height: 56, borderRadius: "50%", background: "#e74c3c", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(231,76,60,0.4)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease" },
  // Menu sidebar styles
  menuOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", justifyContent: "flex-end", animation: "fadeIn 0.3s ease" },
  menuPanel: { width: "85%", maxWidth: 400, background: "#fff", height: "100%", overflow: "auto", padding: "24px 20px", animation: "slideInRight 0.3s ease" },
  menuHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  menuCloseBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#222", display: "flex", alignItems: "center" },
  menuList: {},
  menuItem: { display: "flex", alignItems: "center", gap: 16, padding: "16px 0", background: "none", border: "none", cursor: "pointer", width: "100%", transition: "opacity 0.2s ease" },
  menuItemRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 0" },
  menuDivider: { height: 1, background: "#f0f0f0" },
  // Language modal styles (Image 7 - Light Mode)
  languageModal: { background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "70vh", overflow: "auto", maxWidth: 480, width: "100%", margin: "auto auto 0", animation: "slideUp 0.3s ease" },
  languageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0" },
  modalCloseBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#222", display: "flex", alignItems: "center", padding: 0 },
  languageList: { padding: "8px 0" },
  languageItem: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "none", border: "none", cursor: "pointer", transition: "background 0.2s ease", color: "#222" },
  languageItemActive: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#fff5f5", border: "none", cursor: "pointer", transition: "background 0.2s ease", color: "#222" },
  languageIconCircle: { width: 48, height: 48, borderRadius: "50%", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c" },
  // Order type modal styles (Image 8)
  orderTypeModal: { background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "70vh", overflow: "auto", maxWidth: 480, width: "100%", margin: "auto auto 0", animation: "slideUp 0.3s ease" },
  orderTypeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0" },
  orderTypeList: { padding: "16px 20px" },
  orderTypeItem: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "#fff", border: "2px solid #f0f0f0", borderRadius: 16, cursor: "pointer", transition: "all 0.2s ease", marginBottom: 12 },
  orderTypeItemActive: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "#fff5f5", border: "2px solid #e74c3c", borderRadius: 16, cursor: "pointer", transition: "all 0.2s ease", marginBottom: 12 },
  orderTypeIcon: { width: 48, height: 48, borderRadius: 12, background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c" },
  // Branch modal styles (Image 9)
  branchModal: { background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflow: "auto", maxWidth: 480, width: "100%", margin: "auto auto 0", animation: "slideUp 0.3s ease" },
  branchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0" },
  branchList: { padding: "8px 0" },
  branchItem: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "none", border: "none", borderBottom: "1px solid #f5f5f5", cursor: "pointer", transition: "background 0.2s ease", color: "#222" },
  branchItemActive: { width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#fff5f5", border: "none", borderBottom: "1px solid #f5f5f5", cursor: "pointer", transition: "background 0.2s ease", color: "#222" },
  branchIcon: { width: 44, height: 44, borderRadius: 12, background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", color: "#e74c3c" },
};

export default Index;
