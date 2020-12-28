import Logo from './logo.js'
import Login from './login.js'
import Signup from './signup.js'

const template = `
  <div class="fixed-bottom fixed-top animate__animated animate__fadeIn">
    <logo></logo>
    <login></login>
    <signup></signup>
  </div>
`
export default {
  components: {
    'logo': Logo,
    'login': Login,
    'signup': Signup,
  },
  template,
  data () {
    return {
    }
  }
}
