import CardInfo from '../../../card-info.js'
import CardHistogram from '../analysis-header/card-histogram.js'
import CardPie from '../analysis-header/card-pie.js'

const template = `
  <b-container class="rounded-corners-25" style="height: calc(100vh - 90px); background: rgba(255, 255, 255, 0.2)">
    <div class='pt-3 px-3 overflow-auto' style='height: 100%;'>
        <b-row>
          <b-col class='p-3'>
            <card-info title='max-stale' value='15%' subtitle='των αιτήσεων' icon='graph-up'></card-info>
          </b-col>
          <b-col class='p-3'>
            <card-info title='min-fresh' value='64%' subtitle='των αιτήσεων' icon='graph-down'></card-info>
          </b-col>
        </b-row>
        <b-row><b-col class='p-3'><card-pie></card-pie></b-col></b-row>
        <b-row><b-col class='pt-3 px-3 pb-4'><card-histogram></card-histogram></b-col></b-row>
    </div>
  </b-container>
`
export default {
  components: {
    'card-info': CardInfo,
    'card-histogram': CardHistogram,
    'card-pie': CardPie,
  },
  template,
  data () {
    return {
    }
  }
}
