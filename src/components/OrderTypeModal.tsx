import { Check } from 'lucide-react';
import { styles } from '../styles';
import { CloseIcon, TruckIcon, MapPinIcon } from './Icons';
import type { DeliveryMode } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from 'react-i18next';

interface Props {
  deliveryMode: DeliveryMode;
  deliveryEnabled: boolean;
  deliveryFee: string;
  onSelectDelivery: () => void;
  onSelectPickup: () => void;
  onClose: () => void;
}

const OrderTypeModal = ({ deliveryMode, deliveryEnabled, deliveryFee, onSelectDelivery, onSelectPickup, onClose }: Props) => {
  const { t } = useTranslation();
  
  return (
  <div style={styles.modalOverlay} className="modal-overlay" onClick={onClose}>
    <div style={styles.orderTypeModal} className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={styles.orderTypeHeader}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{t('orderType')}</h2>
        <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.orderTypeList}>
        {deliveryEnabled && (
          <button
            style={deliveryMode === "delivery" ? styles.orderTypeItemActive : styles.orderTypeItem}
            onClick={onSelectDelivery}
          >
            <div style={styles.orderTypeIcon}>
              <TruckIcon />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{t('delivery')}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                {Number(deliveryFee) > 0 ? `${t('deliveryFee')}: ${formatPrice(Number(deliveryFee))} ${t('som')}` : t('delivery')}
              </div>
            </div>
            {deliveryMode === "delivery" && (
              <Check size={28} color="var(--accent)" strokeWidth={2.5} className="check-icon" />
            )}
          </button>
        )}
        <button
          style={deliveryMode === "pickup" ? styles.orderTypeItemActive : styles.orderTypeItem}
          onClick={onSelectPickup}
        >
          <div style={styles.orderTypeIcon}>
            <MapPinIcon />
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{t('pickup')}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>{t('selectBranch')}</div>
          </div>
          {deliveryMode === "pickup" && (
            <Check size={28} color="var(--accent)" strokeWidth={2.5} className="check-icon" />
          )}
        </button>
      </div>
    </div>
  </div>
);
};

export default OrderTypeModal;
