import { styles } from '../styles';
import { SearchIcon } from '../components/Icons';
import type { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface Props {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredProducts: Product[];
  categories: string[];
  cart: Record<number, number>;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  onProductSelect: (product: Product) => void;
  loading?: boolean;
}

const HomeScreen = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  filteredProducts,
  categories,
  cart,
  addToCart,
  removeFromCart,
  onProductSelect,
  loading,
}: Props) => (
  <>
    <div style={styles.searchBox} className="search-box">
      <SearchIcon />
      <input
        style={styles.searchInput}
        placeholder="Qidirish"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div style={styles.categories} className="categories-row">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          style={activeCategory === cat ? styles.catActive : styles.catBtn}
          className={activeCategory === cat ? "category-btn-active" : "category-btn"}
        >
          {cat}
        </button>
      ))}
    </div>

    <h1 style={styles.sectionTitle} className="section-title">{activeCategory}</h1>

    <div style={styles.grid} className="product-grid">
      {filteredProducts.map((product) => (
        <div key={product.id} style={styles.card}>
          <div style={styles.cardImageWrap} className="card-image-wrap" onClick={() => onProductSelect(product)}>
            <img src={product.image_url} alt={product.name} style={styles.cardImage} loading="lazy" />
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
          <div style={styles.cardPrice}>{formatPrice(Number(product.price))}</div>
          <div style={styles.cardName}>{product.name}</div>
        </div>
      ))}
    </div>
  </>
);

export default HomeScreen;
