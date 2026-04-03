import { Check } from 'lucide-react';
import { styles } from '../styles';
import { CloseIcon, MapPinIcon } from './Icons';
import { BRANCHES } from '../data/constants';
import type { Branch } from '../types';

interface Props {
  selectedBranch: Branch;
  onSelect: (branch: Branch) => void;
  onClose: () => void;
}

const BranchModal = ({ selectedBranch, onSelect, onClose }: Props) => (
  <div style={styles.modalOverlay} className="modal-overlay" onClick={onClose}>
    <div style={styles.branchModal} className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={styles.branchHeader}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Filialni tanlang</h2>
        <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
      </div>
      <div style={styles.branchList}>
        {BRANCHES.map((branch) => (
          <button
            key={branch.id}
            style={selectedBranch.id === branch.id ? styles.branchItemActive : styles.branchItem}
            onClick={() => onSelect(branch)}
          >
            <div style={styles.branchIcon}>
              <MapPinIcon />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#222" }}>{branch.name}</div>
              <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>{branch.address}</div>
            </div>
            {selectedBranch.id === branch.id && (
              <Check size={28} color="#2d5a3d" strokeWidth={2.5} className="check-icon" />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default BranchModal;
