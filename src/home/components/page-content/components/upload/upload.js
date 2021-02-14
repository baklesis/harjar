import Card from '../card.js'
// class declarations for use in importing HAR data
class Request{
  constructor(method,url,header){
    this.method = method;
    this.url = url;
    this.cache_control = header.cache_control;
    this.pragma = header.pragma;
    this.host = header.host;
  }
}
class Response{
  constructor(status,text,header){
    this.status = status;
    this.status_text = text;
    this.content_type = header.content_type;
    this.cache_control = header.cache_control;
    this.expires = header.expires;
    this.age = header.age;
    this.last_modified = header.last_modified;
  }
}
class Entry{
  constructor(sdt,wait,serverIP,isp,city,request,response){
    this.startedDateTime = sdt;
    this.wait = wait;
    this.serverIPAddress = serverIP;
    this.isp = isp;
    this.city = city;
    this.request = request;
    this.response = response;
  }
}

const template = `
<div>
  <card class="pt-3 pb-4">
    <h5 class='px-1 text-muted'>Εισαγωγή αρχείου HAR</h5>
    <hr>
    <div class='p-2'>
      <p>Επιλέγοντας να ανεβάσετε ένα αρχείο HAR στην ιστοσελίδα,
      αποκτάτε πρόσβαση σε μια οπτικοποίηση των δεδομένων περιήγησής σας
      σε χάρτη τύπου "Heatmap" οπου φαίνεται η γεωγραφική πυκνότητα των αιτήσεων σας σε διάφορες IP του κόσμου.</p>
      <p>Μόλις επιλέξετε να εισάγετε ένα αρχείο HAR στο σύστημα, γίνεται καθαρισμός των προσωπικών σας δεδομένων. Αφού ολοκληρωθεί η εισαγωγή του αρχείου θα έχετε την επιλογή
      είτε να αποθηκεύσετε το αρχείο τοπικά στον browser για να δείτε στην συνέχεια στον χάρτη ποια δεδομένα ανεβάσατε, είτε να αποθηκεύσετε το αρχείο στο σύστημά μας, για να καταγραφεί μόνιμα
      ως μέρος της συλλογής δεδομένων για τη δημιουργία του χάρτη περιήγησής σας
      στο διαδίκτυο.</p>
      <b-col class='p-0'>
        <b-row class='no-gutters'>
          <b-col class='d-flex flex-column pr-1'><b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Επιλέξτε ένα αρχείο ή ρίξτε το εδώ..."
            drop-placeholder="Αφήστε το αρχείο εδώ..."
            browse-text="Αναζήτηση"
            accept=".har">
          </b-form-file></b-col>
          <div style='width:340px'>
            <b-button :disabled.sync="show" @click="importHAR" variant='success'>Εισαγωγή αρχείου</b-button>
            <b-button @click="resetForm">Καθάρισμα επιλογής</b-button>
          </div>
        </b-row>
      </b-col>
      <b-collapse v-model="show">
        <p class='pt-2'>
          Η εισαγωγή του αρχείου ολοκληρώθηκε επιτυχώς.
        </p>
        <hr>
        <b-col class='p-0'>
          Θα θέλατε το αρχείο να παραμείνει
          τοπικά (τα δεδομένα θα διαγραφούν μόλις αποσυνδεθείτε) ή να αποθηκευθεί
          στην υπηρεσία μας (τα δεδομένα από το αρχείο θα παραμείνουν αποθηκευμένα
          στο λογαριασμό σας);
          <b-form>
           <b-form-group>
            <b-form-radio v-model="upload" value='false'>Τοπική αποθήκευση</b-form-radio>
            <b-form-radio v-model="upload" value='true'>Αποθήκευση στο λογαριασμό (ανέβασμα στην υπηρεσία)</b-form-radio>
          </b-form-group>
          <b-button @click="onSubmit" id='done-button' class='btn-colored' style='width:122px; height:38px'>Ολοκλήρωση</b-button>
          </b-form>
        </b-col>
      </b-collapse>
    </div>
  </card>
  <b-alert class="my-4" show dismissible v-if="history" @dismissed=deleteLocalFiles>
    Έχετε ήδη αποθηκεύσει δεδομένα τοπικά, για να τα διαγράψετε κλείστε αυτό το μήνυμα
  </b-alert>
</div>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      file: null,
      entries: [],
      show: false,
      upload: false,
      isp: null,
      city: null
    }
  },
  computed:{
    history: function(){
      return (window.localStorage.getItem('local_entries')!==null);
    }
  },
  mounted() {
    // On mount, we get the current isp
    this.getIsp();
  },
  methods: {
    deleteLocalFiles(){
      window.localStorage.removeItem('local_entries');
    },
    // Sends the modified file to the server,
    // upon user choice to upload.
    onSubmit(){
      // show loading spinner on button
      document.getElementById('done-button').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
      // create json string of entries
      const data = JSON.stringify(this.entries);
      if(this.upload){
        console.log("Checking session");
        axios.get('./php/get_session.php').then(function(response){
          let username = response.data['username'];
          console.log("Starting upload...");
          axios.post('./php/import.php',{data,username})
          .then(function (response) {
            if(response.data){
              location.reload()  // reload page
              console.log("Success")
              console.log(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          })
        })
      }
      else{
        location.reload()  // reload page
        window.localStorage.setItem('local_entries',data);
      }
    },
    // Resets the user import form
    resetForm(){
      this.file=null;
      this.show=false;
    },
    // Requests data based on the user's current IP address,
    // and passes the isp and city response variables to the local data variables.
    getIsp(){
      var isp=null;
      axios.post('http://ip-api.com/json/').then((response)=>{
        this.isp = response.data.isp;
        this.city = response.data.city;
        console.log(this.isp);
        console.log(this.city);
      })
    },
    // Method borrowed from the beloved StackOverflow
    domain_from_url(url) {
    var result;
    var match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1];
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1];
        }
      }
      return result
    },
    // This functions breaks down the cache-control directives
    // provided in the HAR string, then filters them accordingly
    processCacheControl(directives){
      var all = ['min-fresh','max-stale','no-cache','no-store','private','public'];
      let final_cache_control = {
        control: [],
        max_age: null
      }
      if(directives)
      {
       // console.log(directives);
        directives = directives.split(', ');
        if(directives)
        {
         // console.log(directives);
          for(var j =0; j<directives.length; j++)
          {
            directives[j] = directives[j].split('=');
            if(directives[j].length>1){
              //console.log(directives[j]);
              if(directives[j][0]=='max-age'){
                final_cache_control.max_age =directives[j][1];
              }
            }
            if(all.includes(directives[j][0])){
              final_cache_control.control.push(directives[j][0]);

            }
          }
        }
      }
      if(!(final_cache_control.control.length || final_cache_control.max_age)){ // if there's no control directive, return a null object
        final_cache_control = null;
      }
      return final_cache_control;
    },
    // This method is responsible for loading and parsing the HAR file
    // as needed for our implementation.
    importHAR(){
      var entries= "";
      const HAR_file = this.file;

      // Setup new FileReader object to read the HAR file
      let reader= new FileReader();
      reader.readAsText(HAR_file,"UTF-8");
      reader.onload = evt => {

        // Once the file is loaded split it into 100-entry chunks (cents)
        let big_var = JSON.parse(evt.target.result);
        entries = big_var.log.entries;
        let cents = Math.ceil(entries.length / 100);
        for (var i = 0; i < cents; i++) {
          let cent = [];
          this.entries.push(cent);
        }

        // Import each entry
        for (var i = entries.length - 1; i >= 0; i--) {

          // Import request header values needed
          let request_header = {
            cache_control: null,
            pragma: null,
            host:null
          };
          var cache_control = '';
          let har_req_headers = entries[i].request.headers;

          for (var j = har_req_headers.length - 1; j >= 0; j--) {
            if (har_req_headers[j].name.toLowerCase() == 'cache-control') cache_control = har_req_headers[j].value;
            if (har_req_headers[j].name.toLowerCase() == 'pragma') request_header.pragma = har_req_headers[j].value;
            if (har_req_headers[j].name.toLowerCase() == 'host') request_header.host = har_req_headers[j].value;
          }
          let request_cache_control = this.processCacheControl(cache_control);

          request_header.cache_control = request_cache_control;
          // Make new request object
          let request = new Request(
            entries[i].request.method,
            this.domain_from_url(entries[i].request.url),
            request_header
          );

          // Import response header values needed
          let response_header = {
            content_type: null,
            cache_control: null,
            expires: null,
            age: null,
            last_modified: null
          }
          let har_res_headers = entries[i].response.headers;
          for (var j = har_res_headers.length - 1; j >= 0; j--) {
            if (har_res_headers[j].name.toLowerCase() == 'content-type') response_header.content_type = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'cache-control') cache_control = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'expires') response_header.expires = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'age') response_header.age = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'last-modified') response_header.last_modified = har_res_headers[j].value;
          }
          let response_cache_control = this.processCacheControl(cache_control);

          response_header.cache_control = response_cache_control;
          // Make new response object
          let response = new Response(
            entries[i].response.status,
            entries[i].response.statusText,
            response_header
          );
          // Make new entry object with request, response and other data
          let entry = new Entry(
            entries[i].startedDateTime,
            entries[i].timings?.wait,
            entries[i].serverIPAddress,
            this.isp,
            this.city,
            request,
            response
            );
          // Push entry into its corresponding cent
          this.entries[Math.floor(i/100)].push(entry);
        }
        // Reverse entries because of loop's descending order
        for (var i = 0; i < this.entries.length; i++) {
          this.entries[i].reverse();
        }
        // Reverse the cents too
        this.entries.reverse();
        console.log("Imported entries (grouped by 100s):");
        console.log(this.entries);
        this.show=true;
        const data=JSON.stringify(this.entries);
        //console.log(data);
        window.localStorage.setItem('local_entries',data);
      }
    }
  }
}
