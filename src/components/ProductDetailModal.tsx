import type { Product } from '../types';
import { styles } from '../styles';
import { HeartIcon, CloseIcon } from './Icons';
import { formatPrice } from '../utils/formatPrice';

interface Props {
  product: Product;
  quantity: number;
  onClose: () => void;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}

const ProductDetailModal = ({ product, quantity, onClose, onAdd, onRemove }: Props) => (
  <div style={styles.modalOverlay} className="modal-overlay" onClick={onClose}>
    <div style={styles.modal} className="modal-product" onClick={(e) => e.stopPropagation()}>
      <div style={styles.modalImageWrap}>
        <button style={styles.modalFav}><HeartIcon /></button>
        <button style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        <img src={product.image_url} alt={product.name} style={styles.modalImage} />
      </div>
      <div style={styles.modalBody}>
        <h2 style={styles.modalTitle}>{product.name}</h2>
        <p style={styles.modalDesc}>{product.description}</p>
        <p style={styles.modalPrice}>{formatPrice(Number(product.price))} so'm</p>
        <div style={styles.modalCounter}>
          <button style={styles.counterBtnLg} onClick={() => onRemove(product.id)}>−</button>
          <span style={styles.counterNumLg}>{quantity}</span>
          <button style={styles.counterBtnLg} onClick={() => onAdd(product.id)}>+</button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailModal;
