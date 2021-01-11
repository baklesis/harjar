import Analysis from './components/analysis/analysis.js'
import RequestMap from './components/request-map/request-map.js'
import Overview from './components/overview/overview.js'
import Upload from './components/upload/upload.js'

const template = `
  <component v-bind:is="content" v-bind="content_props"></component>
`

export default {
  components: {
    'analysis': Analysis,
    'request-map': RequestMap,
    'overview': Overview,
    'upload': Upload
  },
  template,
  props: ['content','content_props'],
  data () {
    return {
    }
  }
}
