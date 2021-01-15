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
  constructor(sdt,wait,serverIP,request,response){
    this.startedDateTime = sdt;
    this.wait = wait;
    this.serverIPAddress = serverIP;
    this.request = request;
    this.response = response;
  }
}

const template = `
<b-container>
    <card class="pt-3 pb-4 px-4">
      <h5>Εισαγωγή αρχείου HAR</h5>
      <hr><p>Επιλέγοντας να ανεβάσετε ένα αρχείο HAR στην ιστοσελίδα,
      αποκτάτε πρόσβαση σε μια οπτικοποίηση των δεδομένων περιήγησής σας
      σε χάρτη, όπου μπλα μπλα.</p>
      <p>Αφού ολοκληρωθεί η εισαγωγή του αρχείου θα έχετε την επιλογή
      να ανεβάσετε το αρχείο HAR στο σύστημά μας, για να καταγραφεί μόνιμα
      ως μέρος της συλλογής δεδομένων για τη δημιουργία του χάρτη περιήγησής σας
      στο διαδίκτυο.</p>
      <b-row><b-col>
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Επιλέξτε ένα αρχείο ή ρίξτε το εδώ..."
        drop-placeholder="Αφήστε το αρχείο εδώ..."
        browse-text="Αναζήτηση"
        accept=".har">
      </b-form-file></b-col>
      <b-col><b-button variant='success' @click="importHAR">Εισαγωγή αρχείου
      </b-button>
      <b-button @click="file = null">Καθάρισμα επιλογής</b-button></b-col>
      </b-row>
      <b-row v-if="show">
      <b-col>
        Η εισαγωγή του αρχείου ολοκληρώθηκε επιτυχώς. 
      </b-col>
      <b-col>
        Θα θέλατε το αρχείο να παραμείνει
        τοπικά (η εισαγωγή θα ισχύσει μόνο για την τωρινή σας συνεδρία) ή να αποθηκευθεί
        στην υπηρεσία μας; (τα δεδομένα από το αρχείο θα παραμείνουν αποθηκευμένα
        στο λογαριασμό σας)
        <b-form>
         <b-form-group>
          <b-form-radio v-model="upload" value='true'>Τοπική αποθήκευση</b-form-radio>
          <b-form-radio v-model="upload" value='false'>Αποθήκευση στο λογαριασμό (ανέβασμα στην υπηρεσία)</b-form-radio>
        </b-form-group>
        </b-form>
      </b-col>
      </b-row>
    </card>
    </b-container>
`
export default {
  components: {
    'card': Card,
  },
  template,
  data () {
    return {
      file: null,
      show: false,
      upload: false
    }
  },
  methods: {
    domain_from_url(url) { // function from StackOverflow
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
  },
    importHAR(){
      var entries= "";
      var data = [];
      const HAR_file = this.file;

      let reader= new FileReader();
      reader.readAsText(HAR_file,"UTF-8");
      reader.onload = evt => {
        let big_var = JSON.parse(evt.target.result);
        entries = big_var.log.entries;
        for (var i = entries.length - 1; i >= 0; i--) {
          
          // import request header values needed
          let request_header = {
            cache_control: null,
            pragma: null,
            host:null
          };
          let har_req_headers = entries[i].request.headers;
          for (var j = har_req_headers.length - 1; j >= 0; j--) {
            if (har_req_headers[j].name.toLowerCase() == 'cache-control') request_header.cache_control = har_req_headers[j].value;
            if (har_req_headers[j].name.toLowerCase() == 'pragma') request_header.pragma = har_req_headers[j].value;
            if (har_req_headers[j].name.toLowerCase() == 'host') request_header.host = har_req_headers[j].value;
          }
          // make new request object
          let request = new Request(
            entries[i].request.method,
            this.domain_from_url(entries[i].request.url),
            request_header
          );

          // import response header values needed
          let response_header = {
            content_type: null,
            cache_control: null,
            expires: null,
            age: null,
            last_modified: null
          }
          let har_res_headers = entries[i].response.headers;
          for (var j = har_res_headers.length - 1; j >= 0; j--) {
            if (har_res_headers[j].name.toLowerCase() == 'content-type') request_header.cache_control = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'cache-control') request_header.cache_control = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'expires') request_header.expires = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'age') request_header.age = har_res_headers[j].value;
            if (har_res_headers[j].name.toLowerCase() == 'last-modified') request_header.last_modified = har_res_headers[j].value;
          }
          //make new response object
          let response = new Response(
            entries[i].response.status,
            entries[i].response.statusText,
            response_header
          );

          //make new entry object with request, response and other data
          let entry = new Entry(
            entries[i].startedDateTime,
            entries[i].timings?.wait,
            entries[i].serverIPAddress,
            request,
            response
            );
          data.push(entry);
        }
        console.log(JSON.stringify(data));
        this.show=true;
      }
    },
    oboeHAR(){
      oboe('../../../../../../../assets/test.har')
      .node('log.entries.*',function (entry)
      {
        console.log(entry.response.content);
      })
    }
  },
  mounted() {
  }
}

/* var entry = {
        startedDateTime: null,
        timings: {
          wait : null
        },
        serverIPAddress: null,
        request:{
          method: null,
          url: null,
          headers: {
            cache-control: null,
            pragma: null,
            host: null
          }
        }
        response:{
          status: null,
          statusText: null,
          headers: {
            content-type: null,
            cache-control: null,
            expires: null,
            age: null,
            last-modified: null
          }
        }
      }; */