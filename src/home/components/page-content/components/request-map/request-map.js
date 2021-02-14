const template = `
    <div id="map" ref="request_map" class='rounded-corners-25' style= "height: 800px; background-color: #75CFF0; box-shadow: 0px 16px 16px 0px rgba(0,0,0,0.10);"></div>
`
class Ip{
  constructor(server,city){
    this.server=server;
    this.city=city;
    this.count=1;
  }
}

class Place{
  constructor(startpoint,endpoint){
    this.startpoint = startpoint;
    this.endpoint = endpoint;
    this.count=1;
  }
}

export default {
  template,
  props: ['user'],
  data () {
    return {
      places: [],
      map: null,
      local: false,
      city_coord: [],
      polylines: [],
      heatmap_cfg: {
        "radius": 30,
        "maxOpacity": .8,
        "scaleRadius": false,
        "useLocalExtrema": true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      },
      markers: [],
      heatmap_layer: null
    }
  },
  methods: {
    // This method is responsible for getting all the data
    // needed to build the map.
    async formMapData(type){
      // Based on user type
      if(type == 'admin'){
        console.log("Getting map data for admin...")
        var test = await axios.get('./php/get_admin_map.php').then((response)=>{
          console.log("Server responded! Response:")
          console.log(response.data);
          var i_peas = [];
          for(var point of response.data){
            var ip = new Ip(point.serverIPAddress,point.city);
            // If IP is already in our i_peas array, don't push it...
            var index = i_peas.findIndex(i => (i.server === ip.server));
            if(index===-1)i_peas.push(ip);
            else{
              // ...just increase the count variable for this IP
              i_peas[index].count++;
            }
          }
          // Find ip with biggest count (this will be used to normalize polyline weight)
          var max_count = i_peas.reduce((a,b)=>a.count>b.count?a:b).count;
          console.log("List of IPs");
          console.log(i_peas);
          var unique_cities = [...new Set(i_peas.map(a => a.city))];
          console.log("Unique cities from those IPs:");
          console.log(unique_cities);

          var city_promises = [];
          for(var i=0; i<unique_cities.length; i++){
            var search_city = encodeURI(unique_cities[i]);
            city_promises[i] = axios.get('https://eu1.locationiq.com/v1/search.php?key=pk.1bc0ed635062895ca1656d76fafba3e8&q='+search_city+'&format=json').then((response)=>{
              this.city_coord.push([parseFloat(response.data[0].lat),parseFloat(response.data[0].lon)]);
            });
          }
          // Once all promises for city coordinates have been settled...
          Promise.allSettled(city_promises).then((response)=>{
            console.log("Source coordinates received. Getting coordinates for endpoints...");
            var coord_promises = [];
            let lost_coord = 0;
            var startpoints =[];
            for (var i = 0; i < i_peas.length; i++) {
              for(var j=0; j<unique_cities.length; j++){
                // This loop matches the IP's city with the unique cities array
                // to figure the line's startpoint
                if(i_peas[i].city === unique_cities[j]){
                  startpoints.push(this.city_coord[j]);
                }
              }
              coord_promises[i] = axios.get('http://api.ipapi.com/api/'+i_peas[i].server+'?access_key=80e7295c8b88072b77d8746bd5c05647').then((response)=>{
                let lat = response.data.latitude;
                let lng = response.data.longitude;
                // Count dropped responses by API
                if(!lat || !lng) {
                  lost_coord++;
                }
                else {
                  var endpoint = [lat,lng];
                  var startpoint = startpoints.reverse().pop();
                  var place = new Place(startpoint,endpoint);
                  this.places.push(place);
                  // Create markers for endpoint
                  var marker = L.marker(endpoint);
                  this.markers.push(marker);
                }
              });
            }
            // Once all promises for server endpoint coordinates have been settled...
            Promise.allSettled(coord_promises).then((response)=>{
              console.log("Endpoint coordinates received! Number of coordinates lost: " + lost_coord);
              for(i=0;i<this.places.length; i++){
                // Copy count variables for each IP
                this.places[i].count = i_peas[i].count;
                // Create polylines
                var norm_factor = 8/(max_count-1); // for max weight = 10
                var polyline = L.polyline([this.places[i].startpoint,this.places[i].endpoint], {color: '#00B9BD', weight: (this.places[i].count*norm_factor+2-norm_factor/*Math.log(this.places[i].count)+1*/)});
                this.polylines.push(polyline);
              }
              console.log("Final data for map:");
              console.log(this.places);
              this.createAdminMap('map');
            });
          });
        });
      }
      else if(type == 'user'){
        this.heatmap_layer = new HeatmapOverlay(this.heatmap_cfg);
        const group_entries = JSON.parse(window.localStorage.getItem('local_entries'));
        if(group_entries) { // if local data exists, load local data
          this.local=true;
          console.log("Found local data. Loading local...");
          const entries = group_entries.flat();
          console.log(entries);
          // Filter IPs and apply user data
          if(entries != null){
          var i_peas = []
          for(var entry of entries){
            if((typeof entry.serverIPAddress !== 'undefined') && (String(entry.response.content_type).includes("html"))){
              if(!(i_peas.includes(entry.serverIPAddress)))i_peas.push(entry.serverIPAddress);
            }
          }
          this.applyUserData(i_peas);
        }
        }
        else { // else load remote data
          this.local=false;
          console.log("No local data found. Loading remote...");
          axios.get('./php/get_user_map.php').then(response => {
            if(response.data != null){
              var i_peas = [];
              for(var ip of response.data){
                if(typeof ip !== 'undefined'){
              if(!(i_peas.includes(ip)))i_peas.push(ip);
            }
          }
              this.applyUserData(i_peas);
            }
          });
        }
      }

    },
    applyUserData(i_peas){
      var place = {
          lat: 0,
          lng: 0,
          count: 1
        }
      var coord_promises = [];
      for (var i = 0; i < i_peas.length; i++) {
         coord_promises[i] = axios.get('http://ip-api.com/json/'+i_peas[i]).then((response)=>{
           let lat = response.data.lat;
           let lng = response.data.lon;
           this.places.push([lat, lng]);
           place.lat = lat;
           place.lng = lng;
           this.heatmap_layer.addData(place);
         });
      }
      console.log(i_peas);
      Promise.allSettled(coord_promises).then((response)=>{
        console.log("Coordinates complete!");
        this.createUserMap('map');
      });
    },
    createUserMap(id) {
      this.map = L.map(id, { dragging: !L.Browser.mobile }).setView([38, 23.85], 4);
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
      this.map.addLayer(this.heatmap_layer);
      if(this.local){
        var popup = L.popup().setLatLng([38,23.85]).setContent("Γειά! Φαίνεται πως έχεις τοπικά δεδομένα αποθηκευμένα, επομένως αυτή τη στιγμή βλέπεις αυτά. Για να δεις τα δεδομένα που είναι αποθηκευμένα στο λογαριασμό σου, πρέπει να διαγράψεις τα τοπικά.").openOn(this.map);
      }
    },

    async createAdminMap(id) {
      this.map = L.map(id, { dragging: !L.Browser.mobile }).setView([38, 23.85], 4);
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
      for(var marker of this.markers){
        marker.addTo(this.map);
      }
      for(var polyline of this.polylines){
        polyline.addTo(this.map);
      }
    }
  },
  mounted() {
    // On mount, load map based on user from session
    axios.post('./php/get_session.php')
    .then((response)=>{
      if (response.data != null){
        this.formMapData(response.data['type']);
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
