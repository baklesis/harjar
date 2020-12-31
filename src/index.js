import Login from './login/login.js'
import Home from './home/home.js'

const App = {
  el: 'main',
  components: {
    'login' : Login,
    'home' : Home,
  },
  data() {
    return {
      curr_page: 'home'
    }
  },
}
window.addEventListener('load', () => {
  new Vue(App)
})
