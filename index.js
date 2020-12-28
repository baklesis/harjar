import PageLogin from './pages/page-login/page-login.js'
import PageMain from './pages/page-main/page-main.js'

const App = {
  el: 'main',
  components: {
    'page-login' : PageLogin,
    'page-main' : PageMain,
  },
  data() {
    return {
      curr_page: 'page-login'
    }
  },
}
window.addEventListener('load', () => {
  new Vue(App)
})
