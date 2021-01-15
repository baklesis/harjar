import CardFilters from './components/card-filters.js'
import ScrollPane from './components/analysis-header/scroll-pane.js'
import CardGraph from './components/analysis-request/card-graph.js'

const template = `
    <b-row>
      <b-col>
        <component :is='getContent'></component>
      </b-col>
      <b-col cols='3'>
        <card-filters></card-filters>
      </b-col>
    </b-row>
`
export default {
  template,
  props: ['content_type'],  // prop for defining analysis component content type: header or request
  components: {
    'card-filters': CardFilters,
    'scroll-pane': ScrollPane,
    'card-graph': CardGraph
  },
  data () {
    return {
      header_saved_filters: {  // saved filter options of each filter-type component in analysis/header page
        content_types: [],
        providers: [],
      },
      request_saved_filters: {  // saved filter options of each filter-type component analysis/request page
        content_types: [],
        days: [],
        providers: [],
        http_methods: []
      },
      content: null,  // content of analysis page tabs: header or request
    }
  },
  computed: {
    getContent() {
      if (this.content_type == 'header') { // if analysis/header tab is selected
        this.content = 'scroll-pane' // show scroll pane as content
      }
      else if (this.content_type == 'request') { // if analysis/request tab is selected
        this.content = 'card-graph' // show graph card as content
      }
      return this.content
    }
  }
}
