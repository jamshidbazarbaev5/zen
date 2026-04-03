import { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { styles } from '../styles';
import { CloseIcon, MapPinIcon, CrosshairIcon } from './Icons';
import LocationPicker from './LocationPicker';
import { reverseGeocode } from '../utils/geocode';

interface Props {
  position: [number, number];
  address: string;
  onPositionChange: (pos: [number, number]) => void;
  onAddressChange: (address: string) => void;
  onClose: () => void;
}

const LocationModal = ({ position, address, onPositionChange, onAddressChange, onClose }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  const handlePositionChange = async (pos: [number, number]) => {
    onPositionChange(pos);
    const addr = await reverseGeocode(pos[0], pos[1]);
    onAddressChange(addr);
  };

  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onPositionChange(coords);
        const addr = await reverseGeocode(coords[0], coords[1]);
        onAddressChange(addr);
        mapRef.current?.flyTo(coords, 16);
        setLocatingUser(false);
      },
      () => setLocatingUser(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.locationModal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.branchHeader}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#222" }}>Manzilni tanlang</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={{ height: 400, width: "100%", position: "relative" }}>
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker position={position} onPositionChange={handlePositionChange} />
          </MapContainer>
          <button
            style={styles.myLocationBtn}
            onClick={goToMyLocation}
            disabled={locatingUser}
          >
            {locatingUser ? (
              <span style={{ fontSize: 18 }}>...</span>
            ) : (
              <CrosshairIcon />
            )}
          </button>
        </div>
        {address && (
          <div style={{ padding: "12px 20px", fontSize: 14, color: "#666", borderTop: "1px solid #f0f0f0" }}>
            <MapPinIcon /> {address}
          </div>
        )}
        <div style={{ padding: "12px 20px 20px" }}>
          <button
            style={{ ...styles.cartButton, justifyContent: "center" }}
            onClick={onClose}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
