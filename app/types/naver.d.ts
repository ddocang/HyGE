declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      setZoom(level: number): void;
      panTo(latlng: LatLng): void;
      getCenter(): LatLng;
      getZoom(): number;
      destroy(): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toString(): string;
      equals(latlng: LatLng): boolean;
      clone(): LatLng;
      toPoint(): Point;
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng);
      extend(latlng: LatLng): void;
      getCenter(): LatLng;
      toString(): string;
      equals(bounds: LatLngBounds): boolean;
      clone(): LatLngBounds;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      setAnimation(animation: number | null): void;
      getPosition(): LatLng;
      getMap(): Map | null;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      toString(): string;
      equals(point: Point): boolean;
      clone(): Point;
    }

    class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
      equals(size: Size): boolean;
      toString(): string;
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
      close(): void;
      setContent(content: string): void;
      setPosition(position: LatLng): void;
      setSize(size: Size): void;
      getMap(): Map | null;
    }

    const MapTypeId: {
      NORMAL: string;
      TERRAIN: string;
      SATELLITE: string;
      HYBRID: string;
    };

    const Position: {
      TOP: number;
      TOP_LEFT: number;
      TOP_RIGHT: number;
      LEFT: number;
      CENTER: number;
      RIGHT: number;
      BOTTOM: number;
      BOTTOM_LEFT: number;
      BOTTOM_RIGHT: number;
    };

    const Event: {
      addListener(target: any, type: string, handler: Function): void;
      removeListener(target: any, type: string, handler: Function): void;
    };

    const Animation: {
      BOUNCE: number;
      DROP: number;
    };

    interface MapOptions {
      center: LatLng;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      mapTypeId?: string;
      draggable?: boolean;
      scrollWheel?: boolean;
      zoomControl?: boolean;
      zoomControlOptions?: {
        position: number;
      };
      mapTypeControl?: boolean;
      mapTypeControlOptions?: {
        position: number;
        style: number;
      };
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      icon?: string | CustomMarkerIcon;
      title?: string;
      animation?: number;
      clickable?: boolean;
      zIndex?: number;
    }

    interface InfoWindowOptions {
      content: string;
      position?: LatLng;
      maxWidth?: number;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      disableAnchor?: boolean;
      pixelOffset?: Point;
      zIndex?: number;
    }

    interface CustomMarkerIcon {
      content: string;
      size: Size;
      anchor: Point;
    }
  }
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}
