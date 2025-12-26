declare module 'colorthief' {
  export default class ColorThief {
    constructor();
    getColor(image: HTMLImageElement | HTMLCanvasElement, quality?: number): [number, number, number];
    getPalette(image: HTMLImageElement | HTMLCanvasElement, colorCount?: number, quality?: number): Array<[number, number, number]>;
  }
}

