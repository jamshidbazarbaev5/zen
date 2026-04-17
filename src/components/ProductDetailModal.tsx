import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import type { Product, ProductDetail, SelectedModifier, CartEntry } from '../types';
import { styles } from '../styles';
import { CloseIcon } from './Icons';
import { formatPrice } from '../utils/formatPrice';
import { getProductDetail } from '../api';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (entry: CartEntry) => void;
}

const ProductDetailModal = ({ product, onClose, onAddToCart }: Props) => {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  // selected[groupId] = modifier_id (for max_amount=1 groups, acts as radio)
  // For multi-select we'd need an array, but API shows max_amount=1 for groups
  const [selected, setSelected] = useState<Record<number, number | null>>({});

  useEffect(() => {
    getProductDetail(product.id)
      .then((d) => {
        setDetail(d);
        // Pre-select only when a modifier has default_amount > 0.
        // Otherwise leave unselected so the user must choose.
        const initial: Record<number, number | null> = {};
        d.modifier_groups.forEach((g) => {
          const def = g.modifiers.find((m) => m.default_amount > 0);
          initial[g.id] = def?.id ?? null;
        });
        setSelected(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [product.id]);

  const getModifierPrice = () => {
    if (!detail) return 0;
    let total = 0;
    for (const group of detail.modifier_groups) {
      const selId = selected[group.id];
      if (selId) {
        const mod = group.modifiers.find((m) => m.id === selId);
        if (mod) total += Number(mod.price);
      }
    }
    return total;
  };

  const unitPrice = Number(product.price) + getModifierPrice();
  const totalPrice = unitPrice * quantity;

  const toggleModifier = (groupId: number, modId: number, required: boolean) => {
    setSelected((prev) => {
      if (prev[groupId] === modId && !required) {
        return { ...prev, [groupId]: null };
      }
      return { ...prev, [groupId]: modId };
    });
  };

  const handleAdd = () => {
    const mods: SelectedModifier[] = [];
    Object.entries(selected).forEach(([, modId]) => {
      if (modId) mods.push({ modifier_id: modId, quantity: 1 });
    });
    onAddToCart({
      productId: product.id,
      quantity,
      modifiers: mods,
      modifierTotal: getModifierPrice(),
    });
    onClose();
  };

  // Check if all required groups have a selection
  const canAdd = detail ? detail.modifier_groups
    .filter((g) => g.required)
    .every((g) => selected[g.id] != null) : false;

  return (
    <div style={styles.modalOverlay} className="modal-overlay" onClick={onClose}>
      <div style={styles.modal} className="modal-product" onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalImageWrap}>
          <button style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
          <img src={product.image_url} alt={product.name} style={styles.modalImage} />
        </div>
        <div style={styles.modalBody}>
          <h2 style={styles.modalTitle}>{product.name}</h2>
          {product.description && <p style={styles.modalDesc}>{product.description}</p>}
          <p style={styles.modalPrice}>{formatPrice(unitPrice)} {t('som')}</p>

          {loading ? (
            <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)" }}>
              {t('loadingText')}
            </div>
          ) : detail && detail.modifier_groups.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 20 }}>
              {detail.modifier_groups.map((group) => (
                <div key={group.id}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
                    }}>
                      {group.name}
                    </span>
                    {group.required && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                        background: "var(--accent)", color: "#fff", textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}>
                        {t('required')}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {group.modifiers.map((mod) => {
                      const isSelected = selected[group.id] === mod.id;
                      const price = Number(mod.price);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => toggleModifier(group.id, mod.id, group.required)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "11px 14px", borderRadius: 12,
                            border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border-color)",
                            background: isSelected ? "var(--accent-light, #f0f5f1)" : "var(--card-bg, var(--bg-primary))",
                            cursor: "pointer", transition: "all 0.15s ease",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%",
                              border: isSelected ? "6px solid var(--accent)" : "2px solid var(--border-color)",
                              background: isSelected ? "#fff" : "transparent",
                              transition: "all 0.15s ease", flexShrink: 0,
                            }} />
                            <span style={{
                              fontSize: 14, color: "var(--text-primary)",
                              fontWeight: isSelected ? 600 : 400,
                            }}>
                              {mod.name}
                            </span>
                          </div>
                          {price > 0 && (
                            <span style={{
                              fontSize: 13, fontWeight: 600, color: "var(--accent)",
                              whiteSpace: "nowrap", marginLeft: 8,
                            }}>
                              +{formatPrice(price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Quantity + Add button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: detail?.modifier_groups.length ? 0 : 12 }}>
            <div style={styles.modalCounter}>
              <button style={styles.counterBtnLg} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span style={styles.counterNumLg}>{quantity}</span>
              <button style={styles.counterBtnLg} onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button
              disabled={!canAdd && detail != null && detail.modifier_groups.some((g) => g.required)}
              onClick={handleAdd}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
                background: "var(--accent)", color: "#fff", fontSize: 16, fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
                opacity: (!canAdd && detail != null && detail.modifier_groups.some((g) => g.required)) ? 0.5 : 1,
              }}
            >
              {formatPrice(totalPrice)} {t('som')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
