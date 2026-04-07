import { styles } from '../styles';
import { ArrowLeftIcon, TrashIcon, MinusIcon } from '../components/Icons';
import type { Product, SelectedModifier } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface CartProduct {
  key: string;
  product: Product;
  qty: number;
  modifiers: SelectedModifier[];
  modifierTotal: number;
}

interface Props {
  cartProducts: CartProduct[];
  onBack: () => void;
  onClear: () => void;
  addToCart: (key: string) => void;
  removeFromCart: (key: string) => void;
}

const CartScreen = ({ cartProducts, onBack, onClear, addToCart, removeFromCart }: Props) => (
  <div style={{ padding: "0 16px" }}>
    <div style={styles.cartHeader}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={styles.backBtn} onClick={onBack}><ArrowLeftIcon /></button>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Savat</h2>
      </div>
      <button style={styles.clearCartBtn} onClick={onClear}>
        <TrashIcon />
        <span style={{ color: "var(--accent)", fontSize: 15 }}>Savatni tozalash</span>
      </button>
    </div>

    {cartProducts.length === 0 && (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#999", fontSize: 16 }}>
        Savat bo'sh
      </div>
    )}
    {cartProducts.map(({ key, product, qty, modifiers, modifierTotal }) => (
      <div key={key} style={styles.cartItem}>
        <img src={product.image_url} alt={product.name} style={styles.cartItemImage} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{product.name}</div>
          {modifiers.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              +{formatPrice(modifierTotal)} so'm
            </div>
          )}
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
            {formatPrice(Number(product.price) + modifierTotal)}
          </div>
        </div>
        <div style={styles.cartItemControls}>
          <button style={styles.cartControlBtn} onClick={() => removeFromCart(key)}>
            <MinusIcon />
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: "center", color: "var(--text-primary)" }}>{qty}</span>
          <button style={styles.cartControlBtnPlus} onClick={() => addToCart(key)}>+</button>
        </div>
      </div>
    ))}
  </div>
);

export default CartScreen;
