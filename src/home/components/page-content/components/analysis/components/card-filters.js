import Card from '../../card.js'
import FilterType from './filter-type.js'

const template = `
  <card style="height: 100%">
    <div class="pt-3 px-1" style='text-align: center;'>Φίλτρα Ιστοαντικειμένων</div>
    <div class="pt-3 px-1">
      <b-button @click='saveSelectedFilters' size="sm">Εφαρμογή</b-button>
      <b-button @click='resetSelectedFilters' size="sm">Καθάρισμα</b-button>
    </div>
    <hr>
    <div class="overflow-auto" style="height: calc(100% - 143px)">
      <div class="pb-3 px-1" v-for='filter_type in getFilterTypes()'>
        <filter-type :id='filter_type.value' :title="filter_type.title" :options="filter_type.options"></filter-type>
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
      content_types: [
        { text: 'Application', value: 'application' },
        { text: 'Audio', value: 'audio' },
        { text: 'Font', value: 'font' },
        { text: 'Image', value: 'image' },
        { text: 'Message', value: 'message' },
        { text: 'Model', value: 'model' },
        { text: 'Multipart', value: 'multipart' },
        { text: 'Text', value: 'text' },
        { text: 'Video', value: 'video' }
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
      providers: [
        { text: 'Vodafone', value: 'vodafone' },
        { text: 'Cosmote', value: 'cosmote' },
        { text: 'Wind', value: 'wind' },
        { text: 'Forthnet', value: 'forthnet' }
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
            { title: "Περιεχόμενο", value: 'content_types', options: this.content_types },
            { title: "Πάροχος", value: 'providers', options: this.providers }
          ]
      }
      else if (this.$parent.content_type == 'request'){  // if analysis/request tab is selected
      // return filter types for request tab
      return [
          { title: "Περιεχόμενο", value: 'content_types', options: this.content_types },
          { title: "Ημέρα", value: 'days', options: this.days },
          { title: "Πάροχος", value: 'providers', options: this.providers },
          { title: "HTTP Μέθοδος", value: 'http_methods', options: this.http_methods }
        ]
      }
    },
    saveSelectedFilters() {  // saves selected filters from each filter-type component to global variable in analysis
      this.$parent.saved_filters.content_types = document.getElementById('content_types').selected
      this.$parent.saved_filters.days = document.getElementById('days').selected
      this.$parent.saved_filters.providers = document.getElementById('providers').selected
      this.$parent.saved_filters.http_methods = document.getElementById('http_methods').selected
    },
    resetSelectedFilters() {  // clears selected filters
      document.getElementById('content_types').__vue__.selected = []
      document.getElementById('days').__vue__.selected = []
      document.getElementById('providers').__vue__.selected = []
      document.getElementById('http_methods').__vue__.selected = []
      this.getSelectedFilters()  // saves selected filters
    }
  }
}
