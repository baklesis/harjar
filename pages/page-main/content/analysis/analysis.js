import ScrollPane from './scroll-pane.js'
import CardFilters from './card-filters.js'

const template = `
  <b-col>
    <b-row>
      <b-col>
        <scroll-pane style="height: calc(100vh - 90px)"></scroll-pane>
      </b-col>
      <b-col  cols='3'>
        <card-filters style="height: calc(100vh - 90px)"></card-filters>
      </b-col>
    </b-row>
  </b-col>
`
export default {
  template,
  components: {
    'scroll-pane': ScrollPane,
    'card-filters': CardFilters,
  },
  data () {
    return {}
  }
}
