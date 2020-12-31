import ScrollPane from './components/scroll-pane.js'
import CardFilters from './components/card-filters.js'

const template = `
  <b-col>
    <b-row>
      <b-col>
        <component :is='getContent' v-bind="content_props"></component>
      </b-col>
      <b-col  cols='3'>
        <card-filters style="height: calc(100vh - 90px)"></card-filters>
      </b-col>
    </b-row>
  </b-col>
`
export default {
  template,
  props: ['content_type'],
  components: {
    'scroll-pane': ScrollPane,
    'card-filters': CardFilters,
  },
  data () {
    return {
      content: null,
      content_props: {}
    }
  },
  computed: {
    getContent() {
      if (this.content_type == 'header') {
        this.content = 'scroll-pane'
        this.content_props = {style: "height: calc(100vh - 90px)"}
      }
      else if (this.content_type == 'request') {
        this.content = 'div'
        this.content_props = {}
      }
      return this.content
    }
  }
}
