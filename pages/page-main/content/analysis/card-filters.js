import Card from '../card.js'
import FilterItem from './filter-item.js'

const template = `
  <card style="height: 100%; width:215px">
    <div class="pt-3 px-1" style='text-align: center;'>Φίλτρα Ιστοαντικειμένων</div>
    <hr>
    <div class="overflow-auto" style="height: calc(100% - 110px)">
      <div class="pb-3 px-1">
        <filter-item title="Περιεχόμενο" :options="content_types"></filter-item>
      </div>
      <div class="pb-3 px-1">
        <filter-item title="Ημέρα" :options="days"></filter-item>
      </div>
      <div class="pb-3 px-1">
        <filter-item title="Πάροχος" :options="providers"></filter-item>
      </div>
      <div class="pb-3 px-1">
        <filter-item title="HTTP Μέθοδος" :options="http_methods"></filter-item>
      </div>
    </div>
  </card>
`
export default {
  components: {
    'card': Card,
    'filter-item': FilterItem,
  },
  template,
  data () {
    return {
      window_height: window.innerHeight,
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
  }
}
