import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Search, ExternalLink, Loader2, Compass } from 'lucide-react';
import { DeliveryLocation } from '../types';

interface MapPickerProps {
  location: DeliveryLocation | null;
  onChangeLocation: (loc: DeliveryLocation) => void;
  customerAddress?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  location,
  onChangeLocation,
  customerAddress = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Default coordinate: Vientiane Patuxay / Center (17.9705, 102.6331)
  const defaultLat = location?.lat || 17.9705;
  const defaultLng = location?.lng || 102.6331;

  // Custom stylish Pin Icon
  const createPinIcon = () => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.5);
            border: 2px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); font-size: 16px; font-weight: bold;">📍</span>
          </div>
          <div style="
            width: 12px;
            height: 5px;
            background: rgba(0,0,0,0.35);
            border-radius: 50%;
            margin-top: 4px;
            filter: blur(1px);
          "></div>
        </div>
      `,
      iconSize: [38, 44],
      iconAnchor: [19, 44],
      popupAnchor: [0, -44]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], {
        icon: createPinIcon(),
        draggable: true
      }).addTo(map);

      marker.bindPopup('<b>ຈຸດຈັດສົ່ງສິນຄ້າ</b><br/>ລາກເພື່ອປັບປ່ຽນຕຳແໜ່ງ').openPopup();

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updateCoords(pos.lat, pos.lng, 'ຕຳແໜ່ງທີ່ເລືອກເອງເທິງແຜນທີ່');
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        updateCoords(e.latlng.lat, e.latlng.lng, 'ຕຳແໜ່ງທີ່ກົດເລືອກເທິງແຜນທີ່');
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Fix size after mount
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // do not destroy on re-render, keep instance
    };
  }, []);

  const updateCoords = (lat: number, lng: number, label?: string) => {
    const formattedLat = parseFloat(lat.toFixed(6));
    const formattedLng = parseFloat(lng.toFixed(6));
    onChangeLocation({
      lat: formattedLat,
      lng: formattedLng,
      addressText: label || location?.addressText || `${formattedLat}, ${formattedLng}`
    });
  };

  // HTML5 Geolocation API: "Get My Location"
  const handleGetMyLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('ອຸປະກອນຂອງທ່ານບໍ່ຮອງຮັບ HTML5 Geolocation API');
      return;
    }

    setIsLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoadingGps(false);
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
          markerRef.current.bindPopup('<b>ຕຳແໜ່ງ GPS ປັດຈຸບັນຂອງທ່ານ</b>').openPopup();
        }
        updateCoords(latitude, longitude, 'ຕຳແໜ່ງ GPS ປັດຈຸບັນ (Live GPS)');
      },
      (err) => {
        setIsLoadingGps(false);
        console.warn('Geolocation error:', err);
        setGpsError('ບໍ່ສາມາດດຶງ GPS ໄດ້ (ກະລຸນາອະນຸຍາດການເຂົ້າເຖິງ Location ຫຼື ເລືອກເທິງແຜນທີ່)');
        // Fallback to center
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([17.9705, 102.6331], 14);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Search address / landmark in Laos via OpenStreetMap Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim() || customerAddress.trim();
    if (!query) return;

    setIsSearching(true);
    setGpsError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Laos')}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
          markerRef.current.bindPopup(`<b>${data[0].display_name.split(',')[0]}</b>`).openPopup();
        }
        updateCoords(lat, lon, data[0].display_name.split(',').slice(0, 3).join(', '));
      } else {
        setGpsError(`ບໍ່ພົບສະຖານທີ່: "${query}" (ລອງຄົ້ນຫາຊື່ສະຖານທີ່ສຳຄັນ ຫຼື ກົດເລືອກເທິງແຜນທີ່)`);
      }
    } catch {
      setGpsError('ການເຊື່ອມຕໍ່ຄົ້ນຫາມີບັນຫາ ກະລຸນາຄລິກເລືອກຈຸດປັກໝຸດເທິງແຜນທີ່ໂດຍກົງ');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickPreset = (name: string, lat: number, lng: number) => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<b>${name}</b>`).openPopup();
    }
    updateCoords(lat, lng, name);
  };

  return (
    <div className="space-y-3">
      {/* Search & GPS Action Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ພິມທີ່ຢູ່, ບ້ານ, ເມືອງ ຫຼື ຊື່ສະຖານທີ່ເພື່ອຄົ້ນຫາ..."
              className="w-full bg-[#041126] border border-blue-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          {/* Blue Button for Search */}
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-md disabled:opacity-60 cursor-pointer"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>ຄົ້ນຫາ</span>
          </button>
        </form>

        {/* Blue Action Button for "Get My Location" (HTML5 Geolocation) */}
        <button
          type="button"
          onClick={handleGetMyLocation}
          disabled={isLoadingGps}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLoadingGps ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>ກຳລັງດຶງ GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-cyan-300" />
              <span>Get My Location</span>
            </>
          )}
        </button>
      </div>

      {gpsError && (
        <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-700/50 p-2 rounded-lg">
          ⚠️ {gpsError}
        </div>
      )}

      {/* Quick Landmark Presets for Convenience */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
        <span className="flex items-center gap-1 text-cyan-300 font-semibold">
          <Compass className="w-3.5 h-3.5" /> ຕົວຢ່າງຈຸດປັກໝຸດ:
        </span>
        <button
          type="button"
          onClick={() => handleQuickPreset('ປະຕູໄຊ (Patuxay Vientiane)', 17.9705, 102.6186)}
          className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border border-blue-700/50 cursor-pointer"
        >
          ປະຕູໄຊ
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset('ທາດຫຼວງ ວຽງຈັນ (Pha That Luang)', 17.9766, 102.6366)}
          className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border border-blue-700/50 cursor-pointer"
        >
          ທາດຫຼວງ
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset('ມະຫາວິທະຍາໄລແຫ່ງຊາດ ດົງໂດກ', 18.0384, 102.6318)}
          className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border border-blue-700/50 cursor-pointer"
        >
          ມຊ ດົງໂດກ
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset('ແຄມຂອງ ວຽງຈັນ (Mekong River Park)', 17.9622, 102.6074)}
          className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-cyan-200 border border-blue-700/50 cursor-pointer"
        >
          ແຄມຂອງ
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border-2 border-blue-600/50 shadow-inner bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-64 z-10" />

        <div className="absolute top-2 right-2 z-[400] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-slate-200 border border-cyan-500/30 shadow flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>ຄລິກ ຫຼື ລາກໝຸດເພື່ອປັບປ່ຽນຈຸດສົ່ງ</span>
        </div>
      </div>

      {/* Selected Coordinates Status & Google Maps Link */}
      {location && (
        <div className="p-2.5 bg-[#041126] border border-blue-700/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-semibold text-cyan-300">
                ພິກັດ GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
              <div className="text-slate-400 text-[11px] line-clamp-1">
                {location.addressText || 'ຕຳແໜ່ງທີ່ຖືກປັກໝຸດໄວ້ສຳລັບຈັດສົ່ງ'}
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-[11px] font-medium flex items-center gap-1 border border-blue-500/50 transition-colors shrink-0"
          >
            <span>ເບິ່ງເທິງ Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
