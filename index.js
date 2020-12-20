import CardFilters from './content/Analysis/card-filters.js'
import CardHistogram from './content/Analysis/Header Analysis/card-histogram.js'
import CardInfo from './content/card-info.js'

const App = {
  el: 'main',
  components: {
    'card-filters' : CardFilters,
    'card-histogram' : CardHistogram,
    'card-info': CardInfo
  }
}
window.addEventListener('load', () => {
  new Vue(App)
})
