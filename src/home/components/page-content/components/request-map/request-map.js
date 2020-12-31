

const template = `
    <div id="map" style= "height: 800px;"></div>
`
export default {
  components: {
  },
  template,
  props: ['user'],
  data () {
    return {
      map_cfg: {
  "radius": 25,
  "maxOpacity": .8,
  "scaleRadius": false,
  "useLocalExtrema": false,
  latField: 'lat',
  lngField: 'lng',
  valueField: 'count'
}
    }
  },
  methods: {
    createMap(id, config) {
      var map = L.map(id, { dragging: !L.Browser.mobile }).setView([38, 23.85], 12);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 2,
      maxZoom: 13,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoiam9hbmdvZyIsImEiOiJja2VpcWJ2NTMyOG00MnNtaWpqejlxYTAwIn0.x3iJFQ5cNLEgBpDTQXfciA',
      dragging: !L.Browser.mobile
}).addTo(map);
      map.scrollWheelZoom.disable();
      var latlngs = [
        [39.5, 23],
        [38, 23.85],
        [37.04, 22.88]
      ];
      var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
      var myIcon = L.icon({
    iconUrl: 'prof_color.jpg',
    iconSize: [38, 38],
    iconAnchor: [22, 44],
    popupAnchor: [-3, -76]
    });
    var myMarker = L.marker([38, 23.85], {icon: myIcon}).addTo(map);

    }
  },
  mounted() {
  this.createMap('map', this.map_cfg);
  }
}