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

    class Polyline {
      constructor(options: PolylineOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPath(path: LatLng[] | LatLng[][]): void;
      getPath(): LatLng[];
      setOptions(options: PolylineOptions): void;
      getOptions(): PolylineOptions;
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
      icon?: any;
      title?: string;
      animation?: number;
      clickable?: boolean;
      zIndex?: number;
    }

    interface ImageIcon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface HtmlIcon {
      content: string;
      size: Size;
      anchor: Point;
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

    interface PolylineOptions {
      map?: Map;
      path?: LatLng[] | LatLng[][];
      strokeWeight?: number;
      strokeOpacity?: number;
      strokeColor?: string;
      strokeStyle?: string;
      strokeLineCap?: string;
      strokeLineJoin?: string;
      visible?: boolean;
      clickable?: boolean;
      zIndex?: number;
    }
  }
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}

declare namespace google.maps.marker {
  class AdvancedMarkerElement {
    constructor(options?: AdvancedMarkerElementOptions);
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    title: string;
    map: google.maps.Map | null;
    content: Element;
    addListener(
      eventName: string,
      handler: Function
    ): google.maps.MapsEventListener;
  }

  interface AdvancedMarkerElementOptions {
    map?: google.maps.Map;
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    title?: string;
    content?: Element;
  }

  class PinElement {
    constructor(options?: PinElementOptions);
    element: Element;
  }

  interface PinElementOptions {
    background?: string;
    borderColor?: string;
    scale?: number;
    glyph?: string;
  }
}

declare namespace google.maps {
  interface MarkerLibrary {
    PinElement: typeof marker.PinElement;
    AdvancedMarkerElement: typeof marker.AdvancedMarkerElement;
  }

  function importLibrary(libraryName: 'marker'): Promise<MarkerLibrary>;
  function importLibrary(libraryName: string): Promise<any>;
}
