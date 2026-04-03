import { Check } from 'lucide-react';
import { styles } from '../styles';
import { CloseIcon, TruckIcon, MapPinIcon } from './Icons';
import type { DeliveryMode } from '../types';

interface Props {
  deliveryMode: DeliveryMode;
  onSelectDelivery: () => void;
  onSelectPickup: () => void;
  onClose: () => void;
}

const OrderTypeModal = ({ deliveryMode, onSelectDelivery, onSelectPickup, onClose }: Props) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.orderTypeModal} onClick={(e) => e.stopPropagation()}>
      <div style={styles.orderTypeHeader}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Buyurtma turini tanlang</h2>
        <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.orderTypeList}>
        <button
          style={deliveryMode === "delivery" ? styles.orderTypeItemActive : styles.orderTypeItem}
          onClick={onSelectDelivery}
        >
          <div style={styles.orderTypeIcon}>
            <TruckIcon />
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#222" }}>Yetkazib berish</div>
            <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>Manzilingizga yetkazib beramiz</div>
          </div>
          {deliveryMode === "delivery" && (
            <Check size={28} color="#e74c3c" strokeWidth={2.5} className="check-icon" />
          )}
        </button>
        <button
          style={deliveryMode === "pickup" ? styles.orderTypeItemActive : styles.orderTypeItem}
          onClick={onSelectPickup}
        >
          <div style={styles.orderTypeIcon}>
            <MapPinIcon />
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#222" }}>Olib ketish</div>
            <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>Filialni tanlang va olib keting</div>
          </div>
          {deliveryMode === "pickup" && (
            <Check size={28} color="#e74c3c" strokeWidth={2.5} className="check-icon" />
          )}
        </button>
      </div>
    </div>
  </div>
);

export default OrderTypeModal;
