import PageHeader from './page-header.js'
import Analysis from './analysis/analysis.js'

const template = `
  <b-col><b-row>
    <b-col cols='2' style='background: white'>
      <div style='height:100px; width: 100px; background: white'></div>
    </b-col>
    <b-col>
      <b-row class='pt-4 pb-3'>
        <page-header></page-header>
      </b-row>
      <b-row>
        <analysis></analysis>
      </b-row>
    </b-col>
  </b-row></b-col>
`
export default {
  components: {
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
