import PageContent from './content/page-content.js'
import PageHeader from './page-header.js'
import Analysis from './content/analysis/analysis.js'

const template = `
  <div class="fixed-bottom fixed-top animate__animated animate__fadeIn"><b-col><b-row>
      <b-col cols='2' style='background: white'>
        <div style='height:100px; width: 100px; background: white'></div>
      </b-col>
      <b-col>
        <b-row class='pt-4 pb-3'>
          <page-header></page-header>
        </b-row>
        <b-row>
          <page-content></page-content>
        </b-row>
      </b-col>
    </b-row></b-col></div>
`
export default {
  components: {
    'page-content': PageContent,
    'page-header': PageHeader,
    'analysis': Analysis
  },
  template,
  props: ['title','subtitle','value','icon'],
  data () {
    return {
    }
  }
}
