import { styles } from '../styles';
import { ArrowLeftIcon, TrashIcon, MinusIcon } from '../components/Icons';
import type { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface CartProduct {
  product: Product;
  qty: number;
}

interface Props {
  cartProducts: CartProduct[];
  onBack: () => void;
  onClear: () => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
}

const CartScreen = ({ cartProducts, onBack, onClear, addToCart, removeFromCart }: Props) => (
  <div style={{ padding: "0 16px" }}>
    <div style={styles.cartHeader}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#222" }}>Savat</h2>
      </div>
      <button style={styles.clearCartBtn} onClick={onClear}>
        <TrashIcon />
        <span style={{ color: "#e74c3c", fontSize: 15 }}>Savatni tozalash</span>
      </button>
    </div>

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
            <MinusIcon />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{qty}</span>
          <button style={styles.cartControlBtnPlus} onClick={() => addToCart(product.id)}>+</button>
        </div>
      </div>
    ))}
  </div>
);

export default CartScreen;
