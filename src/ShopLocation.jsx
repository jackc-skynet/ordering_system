import React, { useState, useEffect, useRef } from 'react';
// Using raw Leaflet directly in MapComponent for better control
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Navigation, Info } from 'lucide-react';

// Fix Leaflet marker icon issue in production/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Shop Location: Taipei 101
const SHOP_POS = [25.0336, 121.5647];
const SHOP_NAME = "門市中心 (台北 101)";
const SHOP_ADDRESS = "台北市信義區信義路五段7號";

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
}

const ShopLocation = ({ onBack }) => {
    const [userPos, setUserPos] = useState(null);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("您的瀏覽器不支援定位功能");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const pos = [latitude, longitude];
                setUserPos(pos);
                setDistance(calculateDistance(SHOP_POS[0], SHOP_POS[1], latitude, longitude));
            },
            (err) => {
                setError("無法獲取您的位置，請確認定位權限已開啟");
                console.error(err);
            }
        );
    }, []);

    // Custom marker icons
    const shopIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ff6b35; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 15px rgba(255,107,53,0.5);">
                <div style="transform: rotate(45deg); color: white; margin-bottom: 2px;">🏠</div>
               </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2563eb; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.5);">
                <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#0f1012' }}>
            {/* Header */}
            <div style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '20px', 
                zIndex: 1000,
                display: 'flex',
                gap: '12px'
            }}>
                <button 
                    onClick={onBack}
                    className="glass"
                    style={{ 
                        padding: '12px', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="glass" style={{ padding: '12px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="#ff6b35" />
                    <span style={{ fontWeight: 'bold' }}>門市定位</span>
                </div>
            </div>

            {/* Map Placeholder or Real Map via CDN/Leaflet direct */}
            <MapComponent 
                shopPos={SHOP_POS} 
                userPos={userPos} 
                shopIcon={shopIcon} 
                userIcon={userIcon} 
            />

            {/* Info Card Overlay */}
            <div style={{ 
                position: 'absolute', 
                bottom: '40px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '450px',
                zIndex: 1000
            }}>
                <div className="glass" style={{ padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{SHOP_NAME}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{SHOP_ADDRESS}</p>
                        </div>
                        {distance && (
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{distance} <span style={{ fontSize: '0.9rem' }}>km</span></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>測量距離</div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.5rem' }}>
                        <button 
                            className="btn-primary" 
                            style={{ justifyContent: 'center', width: '100%' }}
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${SHOP_POS[0]},${SHOP_POS[1]}`)}
                        >
                            <Navigation size={18} />
                            規劃路線
                        </button>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}>
                            <Info size={16} />
                            <span style={{ fontSize: '0.85rem' }}>營業中</span>
                        </div>
                    </div>

                    {error && (
                        <div style={{ marginTop: '1rem', padding: '8px', borderLeft: '3px solid #ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fontSize: '0.8rem', color: '#fca5a5' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simplified Map Component Injection to handle Leaflet easily
const MapComponent = ({ shopPos, userPos, shopIcon, userIcon }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        mapInstance.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView(shopPos, 14);

        // Dark theme tiles (OSM Bright-ish but we'll use a public dark one or CartoDB Dark)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(mapInstance.current);

        // Shop Marker
        L.marker(shopPos, { icon: shopIcon }).addTo(mapInstance.current)
            .bindPopup(SHOP_NAME)
            .openPopup();

        // User Marker & Connection if available
        if (userPos) {
            L.marker(userPos, { icon: userIcon }).addTo(mapInstance.current);
            
            // Draw a dashed path
            const polyline = L.polyline([shopPos, userPos], { 
                color: '#ff6b35', 
                weight: 2, 
                dashArray: '10, 10', 
                opacity: 0.6 
            }).addTo(mapInstance.current);

            // Fit bounds to show both
            mapInstance.current.fitBounds(polyline.getBounds(), { padding: [100, 100] });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
        };
    }, [userPos]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />;
};

export default ShopLocation;
