import Card from '../../card.js'
import FilterType from './filter-type.js'

const template = `
  <card style="height: calc(100vh - 110px); width: 220px">
    <div class="pt-3 px-1" style='text-align: center;'>Φίλτρα Ιστοαντικειμένων</div>
    <div class="pt-3 px-1">
      <b-button @click='saveSelectedFilters' size="sm">Εφαρμογή</b-button>
      <b-button @click='resetSelectedFilters' size="sm">Καθάρισμα</b-button>
    </div>
    <hr>
    <div class="overflow-auto" style="height: calc(100% - 143px)">
      <div class="pb-3 px-1" v-for='filter_type in getFilterTypes()'>
        <filter-type :id='filter_type.value' :key='filter_type.value' :title="filter_type.title" :options="filter_type.options"></filter-type>
      </div>
    </div>
  </card>
`
export default {
  components: {
    'card': Card,
    'filter-type': FilterType,
  },
  template,
  data () {
    return {
      // filter option items
      providers: [],  // loaded from db in mounted
      content_types: [
        { text: 'Application', value: 'application' },
        { text: 'Audio', value: 'audio' },
        { text: 'Font', value: 'font' },
        { text: 'Image', value: 'image' },
        { text: 'Message', value: 'message' },
        { text: 'Model', value: 'model' },
        { text: 'Multipart', value: 'multipart' },
        { text: 'Text', value: 'text' },
        { text: 'Video', value: 'video' },
        { text: 'Undefined', value: 'undefined' }
      ],
      days: [
        { text: 'Δευτέρα', value: 'monday'},
        { text: 'Τρίτη', value: 'tuesday'},
        { text: 'Τετάρτη', value: 'wednesday'},
        { text: 'Πέμπτη', value: 'thursday'},
        { text: 'Παρασκευή', value: 'friday'},
        { text: 'Σάββατο', value: 'saturday'},
        { text: 'Κυριακή', value: 'sunday'},
      ],
      http_methods: [
        { text: 'GET', value: 'GET'},
        { text: 'HEAD', value: 'HEAD'},
        { text: 'POST', value: 'POST'},
        { text: 'PUT', value: 'PUT'},
        { text: 'DELETE', value: 'DELETE'},
        { text: 'CONNECT', value: 'CONNECT'},
        { text: 'OPTIONS', value: 'OPTIONS'},
        { text: 'TRACE', value: 'TRACE'},
        { text: 'PATCH', value: 'PATCH'},
      ]
    }
  },
  methods: {
    getFilterTypes() {
      if (this.$parent.content_type == 'header'){  // if analysis/header tab is selected
        // return filter types for header tab
        return [
            { title: "Περιεχόμενο", value: 'header_content_types', options: this.content_types },
            { title: "Πάροχος", value: 'header_providers', options: this.providers }
          ]
      }
      else if (this.$parent.content_type == 'request'){  // if analysis/request tab is selected
      // return filter types for request tab
      return [
          { title: "Περιεχόμενο", value: 'request_content_types', options: this.content_types },
          { title: "Ημέρα", value: 'request_days', options: this.days },
          { title: "Πάροχος", value: 'request_providers', options: this.providers },
          { title: "HTTP Μέθοδος", value: 'request_http_methods', options: this.http_methods }
        ]
      }
    },
    saveSelectedFilters() {  // saves selected filters from each filter-type component to global variable in analysis
      if (this.$parent.content_type == 'header'){  // if analysis/header tab is selected
        this.$parent.header_saved_filters.content_types = document.getElementById('header_content_types').__vue__.selected
        this.$parent.header_saved_filters.providers = document.getElementById('header_providers').__vue__.selected
        //reload scroll-pane
        this.$parent.$refs.scrollpane.loadData()
      }
      else if (this.$parent.content_type == 'request'){  // if analysis/request tab is selected
        this.$parent.request_saved_filters.content_types = document.getElementById('request_content_types').__vue__.selected
        this.$parent.request_saved_filters.days = document.getElementById('request_days').__vue__.selected
        this.$parent.request_saved_filters.providers = document.getElementById('request_providers').__vue__.selected
        this.$parent.request_saved_filters.http_methods = document.getElementById('request_http_methods').__vue__.selected
        //reload graph
        this.$parent.$refs.graph.loadData()
      }
    },
    resetSelectedFilters() {  // clears selected filters
      if (this.$parent.content_type == 'header'){  // if analysis/header tab is selected
        document.getElementById('header_content_types').__vue__.selected = []
        document.getElementById('header_providers').__vue__.selected = []
      }
      else if (this.$parent.content_type == 'request'){  // if analysis/request tab is selected
        document.getElementById('request_content_types').__vue__.selected = []
        document.getElementById('request_days').__vue__.selected = []
        document.getElementById('request_providers').__vue__.selected = []
        document.getElementById('request_http_methods').__vue__.selected = []
      }
      this.saveSelectedFilters()  // saves selected filters
    }
  },
  mounted() {
    // get provider filter options from db
    axios.get('./php/get_providers.php')
    .then((response)=>{
      this.providers = []
      for(let i in response.data){
        let provider = response.data[i]
        this.providers.push({ text: provider, value: provider})
      }
    })
    .catch(function (error) {
        console.log(error);
    })
  }
}
