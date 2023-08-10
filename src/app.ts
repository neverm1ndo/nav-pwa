import { registerSW } from 'virtual:pwa-register';

import './style.scss';

import Leaflet from 'leaflet';
import { Navigation } from './core/navigation';

export class Application extends HTMLElement {
  constructor() {
    super();
    this._resizeObserver.observe(document.body);
    this._navigation.init();
  }

  private _navigation: Navigation = new Navigation(
    new Leaflet.Map(this, { zoomControl: false }),
    {
      marker: Leaflet.icon({
        iconUrl: '/dot.png',
        iconSize: [20, 20],
      }),
      tilesPath: '/tiles',
      offset: -0.011,
      defaultZoom: 16,
    }
  );

  private _resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this._fitScreenSize();
  });

  private _fitScreenSize(): void {
    this.style.width = window.innerWidth + 'px';
    this.style.height = window.innerHeight + 'px';
  }
}

customElements.define('nav-app', Application);
const updateSW: (reloadPage?: boolean) => Promise<void> = registerSW({
  onNeedRefresh() {
    if (!confirm("New content available. Reload?")) return;
    updateSW(true);
  },
});






