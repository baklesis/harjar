import CardFilters from './content/Analysis/card-filters.js'
import CardHistogram from './content/Analysis/Header Analysis/card-histogram.js'
import CardPie from './content/Analysis/Header Analysis/card-pie.js'
import CardInfo from './content/card-info.js'
import ScrollPane from './content/Analysis/scroll-pane.js'
import CardBar from './content/Overview/card-bar.js'
import DataMap from './content/Map/map.js'

const App = {
  el: 'main',
  components: {
    'card-filters' : CardFilters,
    'card-histogram' : CardHistogram,
    'card-pie' : CardPie,
    'card-info' : CardInfo,
    'scroll-pane': ScrollPane,
    'card-bar': CardBar,
    'data-map': DataMap,
  }
}
window.addEventListener('load', () => {
  new Vue(App)
})
