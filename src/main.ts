import { registerSW } from 'virtual:pwa-register';

import './style.css';
import './leaflet.css';

import Leaflet from 'leaflet';

const updateSW: (reloadPage?: boolean) => Promise<void> = registerSW({
  onNeedRefresh() {
    if (!confirm("New content available. Reload?")) return;
    
    updateSW(true);
  },
});

const mapContainer: HTMLDivElement = document.createElement('div');
      mapContainer.id = 'map';
      mapContainer.style.width = window.innerWidth + 'px';
      mapContainer.style.height = window.innerHeight + 'px';

document.querySelector('#app')!.appendChild(mapContainer);

const map: Leaflet.Map = Leaflet.map(mapContainer.id)
                                .setView([56.813, 35.92567], 10);

Leaflet.tileLayer('/tiles/{z}/{x}/{y}.png', { maxZoom: 18 })
       .addTo(map);

const positionIcon: Leaflet.Icon<Leaflet.IconOptions> = Leaflet.icon({
  iconUrl: '/dot.png',
  iconSize: [10, 10],
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(({ coords }: GeolocationPosition) => {
    const { latitude, longitude }: GeolocationCoordinates = coords;
    const userPositionMarker: Leaflet.Marker = new Leaflet.Marker([latitude, longitude], { icon: positionIcon });
          userPositionMarker.addTo(map);
    map.setView([latitude, longitude], 10);
  });
}


