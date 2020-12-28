import Analysis from './analysis/analysis.js'
//import Map from './map/map.js'
import Overview from './overview/overview.js'

const template = `
  <component v-bind:is="content" v-bind="content_props"></component>
`
export default {
  components: {
    'analysis': Analysis,
    //'map': Map,
    'overview': Overview
  },
  template,
  props: ['content','content_props'],
  data () {
    return {
    }
  }
}
