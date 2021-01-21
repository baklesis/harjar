const template = `
    <div id="map" ref="request_map" style= "height: 800px;">{{places}}</div>
`
export default {
  template,
  props: ['user'],
  data () {
    return {
      places: [],
      map: null,
      polyline: null,
      heatmap_cfg: {
        "radius": 25,
        "maxOpacity": .8,
        "scaleRadius": false,
        "useLocalExtrema": false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      },
      heatmap_layer: null
    }
  },
  methods: {
    formMapData(){
      var place = {
        lat: 0,
        lng: 0,
        count: 1
      }
      this.heatmap_layer = new HeatmapOverlay(this.heatmap_cfg);
      const entries = JSON.parse(window.localStorage.getItem('local_entries'));
      console.log(entries);
      if(entries != null){
        var i_peas = []
        for(var entry of entries){
          if(typeof entry.serverIPAddress !== 'undefined'){
            if(!(i_peas.includes(entry.serverIPAddress)))i_peas.push(entry.serverIPAddress);
          }
        }
        for (var i = 0; i < i_peas.length; i++) {
          axios.get('http://ip-api.com/json/'+i_peas[i]).then((response)=>{
            let lat = response.data.lat;
            let lng = response.data.lon;
            this.places.push([lat, lng]);
            place.lat = lat;
            place.lng = lng;
            this.heatmap_layer.addData(place)
            })
        }
        console.log(i_peas);
      } 
    },
    createMap(type){
      if(type=='admin')this.createAdminMap('map')
      else if(type=='user')this.createUserMap('map', this.heatmap_cfg)
    },
    createUserMap(id, config) {
      //var test = JSON.parse(window.localStorage.getItem('local_entries'));
      var obj = {
        lat: null,
        lng: null
      }
      var objs = [];
      for (var i = 0; i < this.places.length; i++) {
        obj.lat = this.places
        objs.push(this.places[i][0])
      }
      this.map = L.map(id, { dragging: !L.Browser.mobile }).setView([38, 23.85], 6);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 2,
      maxZoom: 13,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoiam9hbmdvZyIsImEiOiJja2VpcWJ2NTMyOG00MnNtaWpqejlxYTAwIn0.x3iJFQ5cNLEgBpDTQXfciA',
      dragging: !L.Browser.mobile
}).addTo(this.map);
      this.map.scrollWheelZoom.disable();
      L.marker([38,24]).addTo(this.map);
      this.map.addLayer(this.heatmap_layer);
    //   var myIcon = L.icon({
    // iconUrl: 'prof_color.jpg',
    // iconSize: [38, 38],
    // iconAnchor: [22, 44],
    // popupAnchor: [-3, -76]
    // });
    //var myMarker = L.marker([38, 23.85], {icon: myIcon}).addTo(map);

    },
    createAdminMap(id) {
      //var test = JSON.parse(window.localStorage.getItem('local_entries'));
      //console.log(test);
      this.map = L.map(id, { dragging: !L.Browser.mobile }).setView([38, 23.85], 6);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 2,
      maxZoom: 13,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoiam9hbmdvZyIsImEiOiJja2VpcWJ2NTMyOG00MnNtaWpqejlxYTAwIn0.x3iJFQ5cNLEgBpDTQXfciA',
      dragging: !L.Browser.mobile
}).addTo(this.map);
      this.map.scrollWheelZoom.disable();
     // this.polyline = L.polyline(this.places, {color: 'red'}).addTo(this.map);
      L.marker([38,24]).addTo(this.map);
    //   var myIcon = L.icon({
    // iconUrl: 'prof_color.jpg',
    // iconSize: [38, 38],
    // iconAnchor: [22, 44],
    // popupAnchor: [-3, -76]
    // });
    //var myMarker = L.marker([38, 23.85], {icon: myIcon}).addTo(map);

    }
  },
  mounted() {
    axios.post('./php/get_session.php')
    .then((response)=>{
      if (response.data != null){
        this.formMapData();
        this.createMap(response.data['type'])
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  },
  updated(){
    console.log(this.places)
    //this.polyline.setLatLngs(this.places);
  }
}