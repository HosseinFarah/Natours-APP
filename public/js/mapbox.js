/* eslint-disable */
import mapboxgl from 'mapbox-gl';

export const showMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGZrIiwiYSI6ImNseGQydWZ6OTAxazMya3NhajFzNHh3OWwifQ.rluqWPwORq32hWs-FEjf1Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hfk/clxd5k02002gl01qreowa5vu3',
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day:${loc.day}:${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    animate: true,
    padding: 175,
  });
};
