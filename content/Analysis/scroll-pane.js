import Card from '../card.js'
import CardInfo from '../card-info.js'
import CardFilters from './card-filters.js'
import CardHistogram from './Header Analysis/card-histogram.js'
import CardPie from './Header Analysis/card-pie.js'

const template = `
  <b-container class="fixed-bottom fixed-top rounded-corners-25" style="width:775px; background: rgba(255, 255, 255, 0.2)">
    <div class='pt-3'></div>
    <div class='overflow-auto' style='height: calc(100% - 50px);'>
      <b-col>
        <b-row>
          <b-col class='p-3'>
            <card-info title='MAX-STALE' value=15 subtitle='των αιτήσεων' icon='graph-up'></card-info>
          </b-col>
          <b-col class='p-3'>
            <card-info title='MIN-FRESH' value=64 subtitle='των αιτήσεων' icon='graph-down'></card-info>
          </b-col>
        </b-row>
        <b-row><b-col class='p-3'><card-pie></card-pie></b-col></b-row>
        <b-row><b-col class='p-3'><card-histogram></card-histogram></b-col></b-row>
      </b-col>
    </div>
  </b-container>
`
export default {
  components: {
    'card': Card,
    'card-info': CardInfo,
    'card-filters': CardFilters,
    'card-histogram': CardHistogram,
    'card-pie': CardPie,
  },
  template,
  data () {
    return {
    }
  }
}
