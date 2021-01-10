import Login from './login/login.js'
import Home from './home/home.js'
const App = {
  el: 'main',
  components: {
    'login' : Login,
    'home' : Home
  },
  data() {
    return {
      curr_page: 'login'
    }
  },
  mounted() {
    axios.post('./php/get_session.php')  // check if user session exists
    .then((response)=>{
      if (response.data != null){ // if user already logged in (session exists)
        this.curr_page = 'home'
      }
      else { // if user not logged in (no session exists)
        this.curr_page = 'login'
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}
window.addEventListener('load', () => {
  new Vue(App)
})

Chart.plugins.unregister(ChartDataLabels); // disables the data labels on charts by default
