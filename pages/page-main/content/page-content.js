import Analysis from './analysis/analysis.js'
import Map from './map/map.js'
import Overview from './overview/overview.js'

const template = `
  <component v-bind:is="curr_content"></component>
`
export default {
  components: {
    'analysis': Analysis,
    'map': Map,
    'overview': Overview
  },
  template,
  data () {
    return {
      curr_content: 'analysis'
    }
  },
  mounted(){
    //if user: curr_content = map
    //if admin: curr_content = overview
  }
}
