import PageHeader from './page-header.js'
import CardFilters from './content/Analysis/card-filters.js'
import CardHistogram from './content/Analysis/Header Analysis/card-histogram.js'
import CardPie from './content/Analysis/Header Analysis/card-pie.js'
import CardInfo from './content/card-info.js'
import ScrollPane from './content/Analysis/scroll-pane.js'

const App = {
  el: 'main',
  components: {
    'page-header' : PageHeader,
    'card-filters' : CardFilters,
    'card-histogram' : CardHistogram,
    'card-pie' : CardPie,
    'card-info' : CardInfo,
    'scroll-pane': ScrollPane,
  }
}
window.addEventListener('load', () => {
  new Vue(App)
})
