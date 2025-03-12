// 1. Mapbox Streets-ko 스타일 (한국어 최적화)
mapboxgl.accessToken =
  'pk.eyJ1IjoiYnJhMTAyNCIsImEiOiJjbTd1aHRqYTEwMHNqMmpvZGhpZ2NsN2JlIn0.e3lMFs2UqO1Xz20QVDnhRQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12?optimize=true&language=ko', // 한국어 최적화
  center: [129.173047, 37.458921],
  zoom: 14,
});

// 마커 추가
new mapboxgl.Marker().setLngLat([129.1667, 37.45]).addTo(map);

// 2. Navigation style with Korean labels
const map2 = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-day-v1?language=ko',
  center: [129.173047, 37.458921],
  zoom: 14,
});

map.on('load', () => {
  map.setLayoutProperty('country-label', 'text-field', ['get', 'name_ko']);
  map.setLayoutProperty('state-label', 'text-field', ['get', 'name_ko']);
  map.setLayoutProperty('settlement-label', 'text-field', ['get', 'name_ko']);
});
