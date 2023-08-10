import Leaflet from 'leaflet';

export interface INavigationOptions {
  marker: Leaflet.Icon<Leaflet.IconOptions>;
  tilesPath: string;
  offset?: number;
  defaultZoom?: number;
}

export interface INavigationLatLng {
  latitude: number | null;
  longitude: number | null;
}

export type POILocation = [ string, number, number ];

export class Navigation {
  
  private _pos_marker?: Leaflet.Marker;
  private _offset: number = 0;
  private _zoom: number = 16;

  
  constructor(
    private _map: Leaflet.Map, 
    public options: INavigationOptions,
  ){
    if (options.offset) this._offset = options.offset;
    if (options.defaultZoom) this._zoom = options.defaultZoom;
  }

  private _initTileLayer(tilesPath: string): Leaflet.TileLayer {
    return Leaflet.tileLayer(tilesPath, { maxZoom: 18 })
                  .addTo(this._map);
  }

  private _initGeolocation(): void {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }: GeolocationPosition) => {
        const { latitude, longitude }: GeolocationCoordinates = coords;
        
        this._pos_marker = new Leaflet.Marker([latitude, longitude], { icon: this.options.marker });
        this._pos_marker.addTo(this._map);
        this._map.setView([latitude, longitude + this._offset], this._zoom);
      
      });

      navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => {
          const latlng: INavigationLatLng = this._getLatLngFromGeolocationCoordinates(position.coords);
          this._onWatchPosition(latlng);
        },
        console.error,
      )
    }
  }

  private _getLatLngFromGeolocationCoordinates(coords: GeolocationCoordinates): INavigationLatLng  {
    const { latitude, longitude }: GeolocationCoordinates = coords;
    return { latitude, longitude };
  }
  
  private _onWatchPosition({ latitude, longitude }: INavigationLatLng): void {
    if (!latitude || !longitude) return;
    const newLatLng: Leaflet.LatLng = new Leaflet.LatLng(latitude, longitude);

    if (!this._pos_marker) return;
    this._pos_marker.setLatLng(newLatLng);
    this._map.setView([latitude, longitude + this._offset], this._zoom);
  }

  private async _getPOI(): Promise<POILocation[]> {
    return fetch('/poi/locations.json')
          .then<POILocation[]>((data: Response) => data.json());
  }

  private _appendPOItoMap(locations: POILocation[]): void {
    for (let location of locations) {
      let [ name, latitude, longitude]: POILocation = location;
      const poiIcon = Leaflet.icon({
            iconUrl: `/img/POI/${name}.png`,
            iconSize: [25, 25], 
          });
      Leaflet.marker([latitude, longitude], { icon: poiIcon })
             .addTo(this._map);
    }
  }

  private async _initPOI(): Promise<void> {
    this._getPOI()
        .then((locations: POILocation[]) => {
          this._appendPOItoMap(locations);
        })
        .catch(console.error);
  }

  public init(): void {
    this._initGeolocation();
    this._initTileLayer(`${this.options.tilesPath}/{z}/{x}/{y}.png`);
    this._initPOI();
    this._map.attributionControl.remove();
  }
}