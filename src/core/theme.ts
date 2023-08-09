export interface IThemeOptions {
    url?: string;
    blur?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    hueRotate?: number;
    invert?: number;
    opacity?: number;
}

export abstract class Theme {
    constructor(public options: IThemeOptions) {
    }

    set() {
        const tileLayer: HTMLElement | null = document.querySelector('.leaflet-tile-pane');
        if (!tileLayer) return;
        const filter: string[] = [];
        
        const options = Object.create(this.options);
       
        for (let option in options) {
            filter.push(option + `(${options[option]})`);
        };
        
        tileLayer.style.filter = filter.join(' '); 
    }
} 