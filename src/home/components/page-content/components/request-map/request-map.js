const template = `
    <div id="map" ref="request_map" class='rounded-corners-25' style= "height: 800px; background-color: #75CFF0; box-shadow: 0px 16px 16px 0px rgba(0,0,0,0.10);"></div>
`

export default {
  template,
  props: ['user'],
  data () {
    return {
      places: [],
      map: null,
      local: false,
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
    formMapData(type){
      // Based on user type
      if(type == 'admin'){
        //console.log("Getting map data for admin...")
        axios.get('./php/get_admin_map.php').then((response)=>{
          if(response.data != null){
            // find max count of data
            var max_count = parseInt(response.data.reduce((a,b)=>parseInt(a.count)>parseInt(b.count)?a:b).count);
            // create map data
            for (var coord_pair of response.data){
              var startpoint = [coord_pair['user_lat'],coord_pair['user_lon']]
              var endpoint = [coord_pair['server_lat'],coord_pair['server_lon']]
              var count = coord_pair['count']
              // Create markers for endpoint
              var marker = L.marker(endpoint);
              this.markers.push(marker);
              // Create polylines
              var norm_factor = 8/(max_count-1); // for max weight = 10
              var polyline = L.polyline([startpoint,endpoint], {color: '#00B9BD', weight: (count*norm_factor+2-norm_factor/*Math.log(this.places[i].count)+1*/)});
              this.polylines.push(polyline);
              //console.log("Final data for map:");
              //console.log(this.places);
            }
            document.getElementById('map').innerHTML = '';
            this.createAdminMap('map');
          }
        })
      }
      else if(type == 'user'){
        this.heatmap_layer = new HeatmapOverlay(this.heatmap_cfg);
        const group_entries = JSON.parse(window.localStorage.getItem('local_entries'));
        if(group_entries) { // if local data exists, load local data
          var server_coords = []
          this.local=true;
          //console.log("Found local data. Loading local...");
          const entries = group_entries.flat();
          //console.log(entries);
          // Filter IPs and apply user data
          if(entries != null){
            for(var entry of entries){
              // if the entry has server coordinates and is of HTML content type
              if((typeof entry.server_lat !== 'undefined') && (typeof entry.server_lon !== 'undefined') && (String(entry.response.content_type).includes("html"))){
                // check if it already exists
                var index = server_coords.findIndex(element => (element.lat == entry.server_lat && element.lng == entry.server_lon) )
                // if it doesn't exist
                if(index==-1){
                  server_coords.push({lat: entry.server_lat, lng: entry.server_lon, count: 1});
                }
                // if it already exists increase the value (count) of the specific coordinate
                else {
                  server_coords[index].count=server_coords[index].count+1
                }
              }
            }
            this.heatmap_layer.addData(server_coords);
            document.getElementById('map').innerHTML = '';
            this.createUserMap('map');
          }
        }
        else { // else load remote data
          this.local=false;
          //console.log("No local data found. Loading remote...");
          axios.get('./php/get_user_map.php').then(response => {
            if(response.data != null){
              for (var coord of response.data){
                this.heatmap_layer.addData({lat: coord.server_lat, lng: coord.server_lon, count:coord.count});
              }
              document.getElementById('map').innerHTML = '';
              this.createUserMap('map');
            }
          })
        }
      }
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
    document.getElementById('map').innerHTML = '<div style="width:fit-content;margin:auto; padding-top:40vh; color: white"><div class="spinner-border spinner-border-sm" role="status"></div> Παρακαλώ περιμένετε...</div>';
    //On mount, load map based on user from session
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
